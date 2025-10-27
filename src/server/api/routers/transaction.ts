import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { detectPlasticType, calculatePrice } from '~/lib/pricing';
import { TIER_CONFIG, getUserTier } from '~/lib/tier';
import { TRPCError } from '@trpc/server';

export const transactionRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // If user is logged in, show only their transactions
    // If admin (no user context), show all transactions
    if (ctx.user) {
      return await ctx.prisma.transaction.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: 'desc' },
      });
    }
    
    // Admin view: all transactions
    return await ctx.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: { id: input.id },
      });

      if (!transaction || transaction.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return transaction;
    }),

  createSellOrder: protectedProcedure
    .input(
      z.object({
        weight: z.number().positive(),
        photoUrl: z.string(),
        plasticType: z.enum(['PET', 'HDPE', 'LDPE', 'PP', 'mixed']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.type !== 'personal') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'เฉพาะบัญชีส่วนบุคคลเท่านั้นที่ขายได้',
        });
      }

      // Check minimum weight for tier
      const tierInfo = TIER_CONFIG[ctx.user.tier as keyof typeof TIER_CONFIG];
      if (input.weight < tierInfo.minWeight) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `น้ำหนักขั้นต่ำสำหรับ ${tierInfo.nameTH} คือ ${tierInfo.minWeight} kg`,
        });
      }

  // Use provided plasticType or detect from photo (mock AI)
  const plasticType = input.plasticType ?? detectPlasticType(input.photoUrl);

      // Calculate price
      const pricing = calculatePrice(
        plasticType,
        input.weight,
        tierInfo.priceMultiplier
      );

      // Create transaction
      const transaction = await ctx.prisma.transaction.create({
        data: {
          userId: ctx.user.id,
          type: 'sell',
          plasticType,
          weight: input.weight,
          pricePerKg: pricing.basePrice / input.weight,
          tierBonus: pricing.tierBonus,
          serviceFee: pricing.serviceFee,
          totalAmount: pricing.total,
          status: 'pending',
          photoUrl: input.photoUrl,
        },
      });

      // Create notification
      await ctx.prisma.notification.create({
        data: {
          userId: ctx.user.id,
          title: 'รอการรับสินค้า 🚚',
          description: `${plasticType} ${input.weight} kg - ประมาณ 2-3 ชั่วโมง`,
          type: 'pickup',
        },
      });

      // Award points (10 per kg)
      const pointsEarned = Math.floor(input.weight * 10);
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          reputationPoints: { increment: pointsEarned },
        },
      });

      // Check and update tier based on new points
      const newTier = getUserTier(updatedUser.reputationPoints);
      if (newTier !== updatedUser.tier) {
        await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: { tier: newTier },
        });

        // Create notification for tier upgrade
        const tierInfo = TIER_CONFIG[newTier as keyof typeof TIER_CONFIG];
        await ctx.prisma.notification.create({
          data: {
            userId: ctx.user.id,
            title: `ยินดีด้วย! คุณเลื่อนระดับเป็น ${tierInfo.nameTH} 🎉`,
            description: `คุณได้รับสิทธิประโยชน์เพิ่มเติม: ขายขั้นต่ำ ${tierInfo.minWeight} kg, โบนัส ${Math.round((tierInfo.priceMultiplier - 1) * 100)}%`,
            type: 'reward',
          },
        });
      }

      return transaction;
    }),

  cancelTransaction: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: { id: input.id },
      });

      if (!transaction || transaction.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (transaction.status !== 'pending') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'สามารถยกเลิกได้เฉพาะรายการที่รอดำเนินการเท่านั้น',
        });
      }

      // Update transaction status
      const updatedTransaction = await ctx.prisma.transaction.update({
        where: { id: input.id },
        data: { status: 'cancelled' },
      });

      // Deduct points (-50 for cancellation)
      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          reputationPoints: { decrement: 50 },
        },
      });

      // Check if tier should be downgraded
      const newTier = getUserTier(updatedUser.reputationPoints);
      if (newTier !== updatedUser.tier) {
        await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: { tier: newTier },
        });
      }

      // Create notification
      await ctx.prisma.notification.create({
        data: {
          userId: ctx.user.id,
          title: 'ยกเลิกรายการ ⚠️',
          description: 'คุณถูกหักคะแนน 50 แต้มจากการยกเลิก',
          type: 'system',
        },
      });

      return updatedTransaction;
    }),

  approve: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: { id: input.id },
      });

      if (!transaction) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (transaction.status !== 'pending') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'สามารถอนุมัติได้เฉพาะรายการที่รอดำเนินการเท่านั้น',
        });
      }

      // Update transaction status
      const updatedTransaction = await ctx.prisma.transaction.update({
        where: { id: input.id },
        data: { status: 'completed' },
      });

      // Create notification
      await ctx.prisma.notification.create({
        data: {
          userId: transaction.userId,
          title: 'การขายสำเร็จ ✅',
          description: `${transaction.plasticType} ${transaction.weight} kg - ${transaction.totalAmount}฿`,
          type: 'reward',
        },
      });

      return updatedTransaction;
    }),

  reject: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.prisma.transaction.findUnique({
        where: { id: input.id },
      });

      if (!transaction) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      if (transaction.status !== 'pending') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'สามารถปฏิเสธได้เฉพาะรายการที่รอดำเนินการเท่านั้น',
        });
      }

      // Update transaction status
      const updatedTransaction = await ctx.prisma.transaction.update({
        where: { id: input.id },
        data: { status: 'cancelled' },
      });

      // Create notification
      await ctx.prisma.notification.create({
        data: {
          userId: transaction.userId,
          title: 'รายการถูกปฏิเสธ ❌',
          description: `${transaction.plasticType} ${transaction.weight} kg - กรุณาติดต่อเจ้าหน้าที่`,
          type: 'system',
        },
      });

      // Refund points if applicable
      await ctx.prisma.user.update({
        where: { id: transaction.userId },
        data: {
          reputationPoints: { decrement: Math.floor(transaction.weight * 10) },
        },
      });

      return updatedTransaction;
    }),
});
