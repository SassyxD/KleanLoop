import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { detectPlasticType, calculatePrice } from '~/lib/pricing';
import { TIER_CONFIG } from '~/lib/tier';
import { TRPCError } from '@trpc/server';

export const transactionRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.transaction.findMany({
      where: { userId: ctx.user.id },
      orderBy: { createdAt: 'desc' },
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
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          reputationPoints: { increment: pointsEarned },
        },
      });

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
      await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          reputationPoints: { decrement: 50 },
        },
      });

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
});
