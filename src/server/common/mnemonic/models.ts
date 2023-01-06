import * as MnemonicQuery from "./mnemonic";
import { MnemonicQuery__DataTimeGroup, MnemonicQuery__RankType, MnemonicQuery__RecordsDuration, MnemonicResponse__CollectionMeta__Metadata__Type } from "./types";
import { prisma } from "server/db/client";
import { CollectionsRank, RankPeriod } from "@prisma/client";

async function findOrCreateCollection(contractAddress: string) {
  const collection = await prisma.collection.findUnique({
    where: {
      address: contractAddress
    }
  });

  if (collection) return collection;

  const meta = await MnemonicQuery.collectionMeta(contractAddress);

  if (!meta || !meta.name) throw new Error("Invalid contract address supplied");

  const bannerImg = meta.metadata.find(
    val => val.type === MnemonicResponse__CollectionMeta__Metadata__Type.bannerImage
  );

  const img = meta.metadata.find(
    val => val.type === MnemonicResponse__CollectionMeta__Metadata__Type.image
  );

  const newCollection = await prisma.collection.create({
    data: {
      address: contractAddress,
      name: meta.name,
      type: "",
      tokens: meta.tokensCount,
      owners: meta.ownersCount,
      salesVolume: meta.salesVolume,
      bannerImg: bannerImg?.value??"",
      image: img?.value??"",
      description: meta.metadata.find(
        value => value.type === MnemonicResponse__CollectionMeta__Metadata__Type.description
      )?.value,
      extURL: meta.metadata.find(
        value => value.type === MnemonicResponse__CollectionMeta__Metadata__Type.extURL
      )?.value,
    }
  });

  if (!newCollection) throw new Error("Error creating collection");

  return newCollection;
}

async function findOrCreateDataPoint(collectionID: string, timeStamp: string) {
  const fromDB = await prisma.dataPoint.findUnique({
    where: {
      collectionId_timestamp: {
        collectionId: collectionID,
        timestamp: timeStamp
      }
    }
  });

  if (!fromDB) {
    return await prisma.dataPoint.create({
      data: {
        collectionId: collectionID,
        timestamp: timeStamp
      }
    });
  }

  return fromDB;
}

async function populateDataPoints(collectionID: string, contractAddress: string) {
  const current = new Date(Date.now());
  const timeStamp = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    current.getHours()
  ).toJSON();

  //Price History
  const prices = await MnemonicQuery.collectionPriceHistory(
    contractAddress, 
    MnemonicQuery__RecordsDuration.sevenDays,
    MnemonicQuery__DataTimeGroup.oneHour,
    timeStamp
  );

  prices.dataPoints.forEach(
    async (pt) => {
      const dP = await findOrCreateDataPoint(collectionID, pt.timestamp);
      const updated = await prisma.dataPoint.update({
        where: {
          collectionId_timestamp: {
            collectionId: collectionID,
            timestamp: pt.timestamp
          }
        }, 
        data: {
          avgPrice: pt.avg,
          maxPrice: pt.max,
          minPrice: pt.min
        }
      });
    }
  );

  //Sales Volume
  const sales = await MnemonicQuery.collectionSalesVolume(
    contractAddress, 
    MnemonicQuery__RecordsDuration.sevenDays,
    MnemonicQuery__DataTimeGroup.oneHour,
    timeStamp
  );

  sales.dataPoints.forEach(
    async (pt) => {
      const dP = await findOrCreateDataPoint(collectionID, pt.timestamp);
      const updated = await prisma.dataPoint.update({
        where: {
          collectionId_timestamp: {
            collectionId: collectionID,
            timestamp: pt.timestamp
          }
        }, 
        data: {
          salesCount: pt.count,
          salesVolume: pt.volume
        }
      });
    }
  );

  //Token Supply
  const tokens = await MnemonicQuery.collectionTokensSupply(
    contractAddress,
    MnemonicQuery__RecordsDuration.sevenDays,
    MnemonicQuery__DataTimeGroup.oneHour,
    timeStamp
  );

  tokens.dataPoints.forEach(
    async (pt) => {
      const dP = await findOrCreateDataPoint(collectionID, pt.timestamp);
      const updated = await prisma.dataPoint.update({
        where: {
          collectionId_timestamp: {
            collectionId: collectionID,
            timestamp: pt.timestamp
          }
        }, 
        data: {
          tokensBurned: pt.burned,
          tokensMinted: pt.minted,
          totalBurned: pt.totalBurned,
          totalMinted: pt.totalMinted
        }
      });
    }
  );

  //Owners Count
  const ownerFigures = await MnemonicQuery.collectionOwnersCount(
    contractAddress,
    MnemonicQuery__RecordsDuration.sevenDays,
    MnemonicQuery__DataTimeGroup.oneHour,
    timeStamp
  );

  ownerFigures.dataPoints.forEach(
    async (pt) => {
      const dP = await findOrCreateDataPoint(collectionID, pt.timestamp);
      const updated = await prisma.dataPoint.update({
        where: {
          collectionId_timestamp: {
            collectionId: collectionID,
            timestamp: pt.timestamp
          }
        }, 
        data: {
          ownersCount: pt.count
        }
      });
    }
  );
}

async function updateOrCreateRankTableEntry(collectionID: string, tableID: string, value: string) {
  try {
    //Will only throw error if the entry does not exist.
    const fromDb = await prisma.rankTableEntry.update({
      where: {
        collectionId_tableId: {
          collectionId: collectionID,
          tableId: tableID
        }
      }, 
      data: {
        value: value
      }
    });
  } catch (err) {
    const newEntry = await prisma.rankTableEntry.create({
      data: {
        collectionId: collectionID,
        tableId: tableID,
        value: value
      }
    });
  }

}

async function findOrCreateRankTable(rank: MnemonicQuery__RankType, timePeriod: MnemonicQuery__RecordsDuration) {
  const fromDb = await prisma.rankTable.findUnique({
    where: {
      type_timePeriod: {
        type: rank.toString() as CollectionsRank,
        timePeriod: timePeriod.toString() as RankPeriod
      }
    }
  });
  if (fromDb) return fromDb;
  
  const newTable = await prisma.rankTable.create({
    data: {
      type: rank.toString() as CollectionsRank,
      timePeriod: timePeriod.toString() as RankPeriod
    }
  });

  return newTable;
}

export async function populateDb() {
  Object.values(MnemonicQuery__RankType).forEach(
    async (rank, _) => { 
      console.log(`===========${rank}=========`)
      await Object.values(MnemonicQuery__RecordsDuration).forEach(
        async (time, _) => {
          console.log(`=========${time}========`)
          const rankTable = await findOrCreateRankTable(rank, time);
          const collections = await MnemonicQuery.getTopCollections(rank, time);
          collections.collections.forEach(
            async (clctn) => {
              const collection = await findOrCreateCollection(clctn.contractAddress);
              console.log(collection.name)
              await updateOrCreateRankTableEntry(collection.id, rankTable.id, clctn.avgPrice || clctn.maxPrice || clctn.salesCount || clctn.salesVolume);
              await populateDataPoints(collection.id, collection.address);
          })
        }
      )
    }
  ); 
}

async function main() {
  await populateDb();
}

main().then(async () => {
  await prisma.$disconnect()
})
.catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
