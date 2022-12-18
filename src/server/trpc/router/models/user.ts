import { router, publicProcedure } from "../../trpc";
import { prisma } from "../../../db/client";
import { z } from "zod";

export const UserRouter = router({
  getUser: publicProcedure
    .input(z.object({
    email: z.string().nullish()
    }).nullish()
    )
    .query(
      ({input}) => {
        if (!input?.email) {
          return null;
        }

        try {
          const user = prisma.user.findUniqueOrThrow({
            where: {
              email: input.email
            }, 
            select: {
              email: true,
              name: true,
              authprofiles: true
            }
          });
          return user;
      } catch (err) {
        return null;
      }
    }),
  getVerifyUser: publicProcedure
    .input(z.object({
      email: z.string().nullish()
    }).nullish())
    .query(
      ({input}) => {
        if (!input?.email) {
          return null;
        }

        try {
          const user = prisma.user.findUniqueOrThrow({
            where: {
              email: input.email
            },
            select: {
              email: true,
              name: true,
              password: true
            }
          });
          return user;
        } catch (err) {
          return null;
        }
      }
    )
  
})