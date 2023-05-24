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
      field: z.string().min(1),
      filter: z.enum(["All", "Name", "Address"])
    }))
    .query(
      async ({input}) => { //As these have very few word vectors as compared to paragraphs, `contains` shall suffice
        const searchQ = input.filter === "All"
          ? { OR: [{ name: { contains: input.field, mode: 'insensitive' as const } }, { address: { contains: input.field, mode: 'insensitive' as const } }] }
          : input.filter === "Name"
          ? { name: { contains: input.field, mode: 'insensitive' as const } }
          : { address: { contains: input.field, mode: 'insensitive' as const } };

        try {
          const collections = await prisma.collection.findMany({
            where: searchQ, 
            select: {
              name: true,
              address: true,
              floor: true,
              image: true,
              
            },
            orderBy: {
              name: "asc"
            },
            take: 10
          });
          return collections;
        } catch (err) {
          console.error(err);
          return []
        }
    }),
  collectionsPage: publicProcedure
    .input(z.object({
      address: z.string()
    }))
    .query(
      async ({ input }) => {
        const address = input.address;
        const current = new Date(Date.now());
        current.setDate(current.getDate() - 365);

        const collection = await prisma.collection.findUnique({
          where: {
            address: address
          },
          include: {
            data: {
              where: {
                timestamp: {
                  gte: current
                }
              },
              orderBy: {
                timestamp: "asc"
              }
            }
          }
        });
        return collection;
      }
    ),
});