import * as MnemonicQuery from "./mnemonic";
import { MnemonicQuery__DataTimeGroup, MnemonicQuery__RankType, MnemonicQuery__RecordsDuration, MnemonicResponse__CollectionMeta__Metadata__Type, MnemonicResponse__OwnersCount, MnemonicResponse__PriceHistory, MnemonicResponse__Rank, MnemonicResponse__SalesVolume, MnemonicResponse__TokensSupply } from "./types";
import { prisma } from "server/db/client";

async function findOrCreateCollection(contractAddress: string) {
  const collection = await prisma.collection.findUnique({
    where: {
      address: contractAddress
    }
  });

  if (collection != null) return collection;

  const meta = await MnemonicQuery.collectionMeta(contractAddress);

  // if (!meta || !meta.name) throw new Error("Invalid contract address supplied");

  const bannerImg = meta.metadata.find(
    val => val.type === MnemonicResponse__CollectionMeta__Metadata__Type.bannerImage
  );

  const img = meta.metadata.find(
    val => val.type === MnemonicResponse__CollectionMeta__Metadata__Type.image
  );
  
  try {
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
    return newCollection;
  } catch (err) {
    //Due to async, another collection may have been created, hence create fails.
    const fromDb = await prisma.collection.findUnique({
      where: {
        address: contractAddress
      }
    });

    return fromDb;
  }

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

  if (fromDB) return fromDB;

  try {
    const newDp = await prisma.dataPoint.create({
      data: {
        collectionId: collectionID,
        timestamp: timeStamp
      }
    });
    return newDp;
  } catch (err) {
    const fromDb = await prisma.dataPoint.findUnique({
      where: {
        collectionId_timestamp: {
          collectionId: collectionID,
          timestamp: timeStamp
        }
      }
    });

    return fromDb;
  }
}

async function populateDataPoints(collectionID: string, contractAddress: string) {
  const current = new Date(Date.now());
  const timeStamp = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    current.getHours()
  ).toJSON();
  
  const prices = await MnemonicQuery.collectionPriceHistory(
    contractAddress, 
    MnemonicQuery__RecordsDuration.sevenDays,
    MnemonicQuery__DataTimeGroup.oneDay,
    timeStamp
  );
  
  try {
    prices.dataPoints.forEach(
      async (pt) => {
        const dP = await findOrCreateDataPoint(collectionID, pt.timestamp);
        return await prisma.dataPoint.update({
          where: {
            id: dP?.id
          }, 
          data: {
            avgPrice: pt.avg,
            maxPrice: pt.max,
            minPrice: pt.min
          }
        });
      }
    );
  } catch (err) {
    console.log(err);
  }
  const sales = await MnemonicQuery.collectionSalesVolume(
    contractAddress, 
    MnemonicQuery__RecordsDuration.sevenDays,
    MnemonicQuery__DataTimeGroup.oneDay,
    timeStamp 
  );
  
  try {
    sales.dataPoints.forEach(
      async (pt) => {
        const dP = await findOrCreateDataPoint(collectionID, pt.timestamp);
        await prisma.dataPoint.update({
          where: {
            id: dP?.id
          }, 
          data: {
            salesCount: pt.count,
            salesVolume: pt.volume
          }
        });
      }
    );
  } catch (err) {
    console.log(err)
  }
  
  const tokens = await MnemonicQuery.collectionTokensSupply(
    contractAddress, 
    MnemonicQuery__RecordsDuration.sevenDays,
    MnemonicQuery__DataTimeGroup.oneDay,
    timeStamp 
  );
  
  try {
    tokens.dataPoints.forEach(
      async (pt) => {
        const dP = await findOrCreateDataPoint(collectionID, pt.timestamp);
        await prisma.dataPoint.update({
          where: {
            id: dP?.id
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
  } catch (err) {
    console.log(err)
  }
  
  const owners = await MnemonicQuery.collectionOwnersCount(
    contractAddress, 
    MnemonicQuery__RecordsDuration.sevenDays,
    MnemonicQuery__DataTimeGroup.oneDay,
    timeStamp
  );
  
  try {
    owners.dataPoints.forEach(
      async (pt) => {
        const dP = await findOrCreateDataPoint(collectionID, pt.timestamp);
        await prisma.dataPoint.update({
          where: {
            id: dP?.id
          }, 
          data: {
            ownersCount: pt.count
          }
        });
      }
    );
  } catch (err) {
    console.log(err);
  }

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
        type: MnemonicQuery.RankMapping[rank],
        timePeriod: MnemonicQuery.TimeRanking[timePeriod]
      }
    }
  });
  if (fromDb) return fromDb;
  
  const newTable = await prisma.rankTable.create({
    data: {
      type: MnemonicQuery.RankMapping[rank],
      timePeriod: MnemonicQuery.TimeRanking[timePeriod]
    }
  });

  return newTable;
}

//Can be called to refresh every day
export async function populateDb() {

  const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

  for (let rank of Object.values(MnemonicQuery__RankType)) {
    for (let time of Object.values(MnemonicQuery__RecordsDuration)) {
      const rankTable = await findOrCreateRankTable(rank, time);
      const { count } = await prisma.rankTableEntry.deleteMany({
        where: {
          tableId: rankTable.id
        }
      });

      //Query data
      const collections = await MnemonicQuery.getTopCollections(rank, time);

      await delay(100);

      for (let clctn of collections.collections) {
        const collection = await findOrCreateCollection(clctn.contractAddress);

          if (collection) {
            //Create the ranking.
            await updateOrCreateRankTableEntry(collection.id, rankTable.id, clctn.avgPrice || clctn.maxPrice || clctn.salesCount || clctn.salesVolume);

            //Populate timeseries
            await populateDataPoints(collection.id, collection.address);

            //Avoid rate limiting
            await delay();
          }
      }

    }
  }

  
}

// export async function refreshTimeSeries() {
//   const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

//   const collections = await prisma.collection.findMany({});

//   for (let clctn of collections) {
//     await populateDataPoints(clctn.id, clctn.address);
//     await delay(500);
//   }

// }
