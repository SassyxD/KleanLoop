import { createTRPCRouter } from './trpc';
import { authRouter } from './routers/auth';
import { userRouter } from './routers/user';
import { transactionRouter } from './routers/transaction';
import { notificationRouter } from './routers/notification';
import { creditRouter } from './routers/credit';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  user: userRouter,
  transaction: transactionRouter,
  notification: notificationRouter,
  credit: creditRouter,
});

export type AppRouter = typeof appRouter;
