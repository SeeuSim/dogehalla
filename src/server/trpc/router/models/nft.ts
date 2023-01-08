import { router, publicProcedure } from "server/trpc/trpc";
import { prisma } from "server/db/client";
import { z } from "zod";
import { CollectionsRank, RankPeriod } from "@prisma/client";

export const NFTRouter = router({
  getTopCollections: publicProcedure
    .input(z.object({
      rank: z.nativeEnum(CollectionsRank),
      time: z.nativeEnum(RankPeriod)
    }))
    .query(
      () => {
      }
    ),
});