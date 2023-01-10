import { router, publicProcedure } from "server/trpc/trpc";
import { prisma } from "server/db/client";
import { z } from "zod";
import { CollectionsRank, RankPeriod } from "@prisma/client";

export const NFTRouter = router({
  getTopCollections: publicProcedure
    .input(z.object({
      rank: z.nativeEnum(CollectionsRank),
      time: z.nativeEnum(RankPeriod),
      cursor: z.number().min(0).nullish(),
      limit: z.number().min(1).nullish()
    }))
    .query(
      async ({input}) => {
        const cursor = input.cursor?? 0;
        const limit = input.limit?? 10;

        const data = await prisma.rankTable.findUnique({
          where: {
            type_timePeriod: {
              type: input.rank,
              timePeriod: input.time
            }
          },
          select: {
            id: true,
            entries: {
              select: {
                id: true,
                collection: {
                  select: {
                    name: true,
                    address: true,
                    image: true,
                    floor: true
                  }
                },
                value: true
              },
              orderBy: {
                value: 'desc'
              },
              skip: cursor * limit,
              take: limit
            },
          }
        });

        const maxRecords = await prisma.rankTableEntry.count({
          where: {
            tableId: data?.id
          }
        });

        return {
          collections: data?.entries?? [],
          max: maxRecords
        };   
      }
    ),
  getCollection: publicProcedure
    .input(z.object({
      address: z.string().min(42)
    }))
    .query(
      async ({input}) => {
        const current = new Date(Date.now());
        current.setDate(current.getDate() - 7);
        const collection = await prisma.collection.findUnique({
          where: {
            address: input.address
          },
          include: {
            data: {
              where: {
                timestamp: {
                  gte: current
                }
              }
            }
          }
        });
        return collection;
      }
    )
});