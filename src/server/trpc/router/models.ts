import {router } from "../trpc";
import { OAuthRouter } from "./models/oauth";
import { UserRouter } from "./models/user";

export const modelsRouter = router({
  oauth: OAuthRouter,
  user: UserRouter
});