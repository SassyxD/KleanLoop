import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { getUserTier } from '~/lib/tier';

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        credits: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Calculate statistics
    const totalSales = user.transactions
      .filter((t) => t.type === 'sell' && t.status === 'completed')
      .length;

    const totalKg = user.transactions
      .filter((t) => t.type === 'sell' && t.status === 'completed')
      .reduce((sum, t) => sum + t.weight, 0);

    const totalEarnings = user.transactions
      .filter((t) => t.type === 'sell' && t.status === 'completed')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const totalCredits = user.credits.reduce((sum, c) => sum + c.amount, 0);

    return {
      ...user,
      stats: {
        totalSales,
        totalKg,
        totalEarnings,
        totalCredits,
      },
    };
  }),

  updateReputationPoints: protectedProcedure
    .input(
      z.object({
        points: z.number(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const newPoints = ctx.user.reputationPoints + input.points;

      if (newPoints < 0) {
        // Ban user
        await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: { reputationPoints: -1 },
        });

        throw new Error('บัญชีของคุณถูกระงับเนื่องจากคะแนนติดลบ');
      }

      const newTier = getUserTier(newPoints);

      const updatedUser = await ctx.prisma.user.update({
        where: { id: ctx.user.id },
        data: {
          reputationPoints: newPoints,
          tier: newTier,
        },
      });

      return updatedUser;
    }),
});
