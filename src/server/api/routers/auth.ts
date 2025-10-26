import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const authRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!user || user.password !== input.password) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
        });
      }

      // In production, set proper httpOnly cookie
      return { user };
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    return { success: true };
  }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
});
