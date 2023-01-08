import {router } from "../trpc";
import { NFTRouter } from "./models/nft";
import { OAuthRouter } from "./models/oauth";
import { UserRouter } from "./models/user";

export const modelsRouter = router({
  nft: NFTRouter,
  oauth: OAuthRouter,
  user: UserRouter
});