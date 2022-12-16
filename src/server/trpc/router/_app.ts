import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";

import connectDB from "../../db/client";
import redisClient from "../../db/connectRedis";

connectDB();

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  testRedis: publicProcedure.query(async ({ ctx }) => {
    const message = await redisClient.get("tRPC");
    return { message };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
