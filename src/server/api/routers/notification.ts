import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';

export const notificationRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z
        .object({
          filter: z.enum(['pickup', 'reward', 'system']).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const where: any = { userId: ctx.user.id };

      if (input?.filter) {
        where.type = input.filter;
      }

      return await ctx.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    }),

  getAll: protectedProcedure
    .input(
      z
        .object({
          type: z.enum(['all', 'pickup', 'reward', 'system']).optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const where: any = { userId: ctx.user.id };

      if (input?.type && input.type !== 'all') {
        where.type = input.type;
      }

      return await ctx.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.notification.update({
        where: { id: input.id },
        data: { isRead: true },
      });
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.notification.updateMany({
      where: { userId: ctx.user.id, isRead: false },
      data: { isRead: true },
    });
  }),

  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.notification.count({
      where: { userId: ctx.user.id, isRead: false },
    });
  }),
});
