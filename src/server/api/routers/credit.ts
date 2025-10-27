import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { CREDIT_PACKAGES } from '~/lib/pricing';
import { TRPCError } from '@trpc/server';

export const creditRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    // If user is logged in, show only their credits
    if (ctx.user) {
      return await ctx.prisma.credit.findMany({
        where: { userId: ctx.user.id },
        orderBy: { createdAt: 'desc' },
      });
    }
    
    // Admin view: all credits
    return await ctx.prisma.credit.findMany({
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

  getPackages: protectedProcedure.query(async () => {
    return CREDIT_PACKAGES;
  }),

  purchase: protectedProcedure
    .input(
      z.object({
        packageId: z.string(),
        customAmount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.type !== 'corporate') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'เฉพาะบัญชีองค์กรเท่านั้นที่ซื้อ credits ได้',
        });
      }

      let amount: number;
      let pricePerCredit: number;
      let packageType: string;

      if (input.packageId === 'custom' && input.customAmount) {
        amount = input.customAmount;
        pricePerCredit = 25; // Base price for custom
        packageType = 'custom';
      } else {
        const pkg = CREDIT_PACKAGES.find((p) => p.id === input.packageId);
        if (!pkg) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'ไม่พบแพ็คเกจที่เลือก',
          });
        }
        amount = pkg.amount;
        pricePerCredit = pkg.pricePerCredit;
        packageType = pkg.id;
      }

      const totalPrice = amount * pricePerCredit;

      // Create credit purchase
      const credit = await ctx.prisma.credit.create({
        data: {
          userId: ctx.user.id,
          amount,
          pricePerCredit,
          totalPrice,
          packageType,
          certificateUrl: `/certificates/cert-${Date.now()}.pdf`,
        },
      });

      // Create notification
      await ctx.prisma.notification.create({
        data: {
          userId: ctx.user.id,
          title: 'ซื้อ Plastic Credits สำเร็จ ✅',
          description: `ซื้อ ${amount} kg credits มูลค่า ${totalPrice.toLocaleString()} บาท`,
          type: 'system',
        },
      });

      return credit;
    }),

  getTotalCredits: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.credit.aggregate({
      where: { userId: ctx.user.id },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }),
});
