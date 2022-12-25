import { z } from "zod";
import { router, publicProcedure } from "server/trpc/trpc";
import { prisma } from "server/db/client";

export const OAuthRouter = router({
  getOAuthProfileOwner: publicProcedure
    .input(
      z.object({
        provider: z.string().nullish(),
        providerOAuthId: z.string().nullish(),
      }).nullish()
    )
    .query(
      ({input}) => {
        if (!input?.provider || !input?.providerOAuthId) {
          return null;
        }
        try {
          const OAuthProfileOwner = prisma.oAuthProfile.findUniqueOrThrow({
            where: {
              provider_providerOAuthId: {
                provider: input?.provider,
                providerOAuthId: input?.providerOAuthId
              }
            }, 
            select: {
              userId: true,
              user: true 
            }
        });
          return OAuthProfileOwner;
        } catch (err) {
          return null;
        }
      }
    ),
  // createOAuthProfile: publicProcedure
  //     .input(z.object({
  //       provider: z.string().nullish(),
        
  //     }))
})