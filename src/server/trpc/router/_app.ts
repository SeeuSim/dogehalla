import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";

import connectDB from "../../db/client";
import redisClient from "../../db/connectRedis";
import { modelsRouter } from "./models";

connectDB();

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  model: modelsRouter,
  testRedis: publicProcedure.query(async ({ ctx }) => {
    const message = await redisClient.get("tRPC");
    return { message };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
