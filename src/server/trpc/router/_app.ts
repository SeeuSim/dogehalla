import { publicProcedure, router } from "../trpc";
import { authRouter } from "./auth";

import connectDB from "../../db/client";
import { modelsRouter } from "./models";

connectDB();

export const appRouter = router({
  auth: authRouter,
  model: modelsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
