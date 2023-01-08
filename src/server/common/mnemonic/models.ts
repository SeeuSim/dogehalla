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
        type: meta.types.join(" "),
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
    
    //Populate the timeseries
    await populateDataPoints(newCollection.id, newCollection.address);

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
    // current.getHours()
  ).toJSON();
  
  const prices = await MnemonicQuery.collectionPriceHistory(
    contractAddress, 
    MnemonicQuery__RecordsDuration.thirtyDays,
    MnemonicQuery__DataTimeGroup.oneDay,
    timeStamp
  );
  
  const sales = await MnemonicQuery.collectionSalesVolume(
    contractAddress, 
    MnemonicQuery__RecordsDuration.thirtyDays,
    MnemonicQuery__DataTimeGroup.oneDay,
    timeStamp 
  );
  
  const tokens = await MnemonicQuery.collectionTokensSupply(
    contractAddress, 
    MnemonicQuery__RecordsDuration.thirtyDays,
    MnemonicQuery__DataTimeGroup.oneDay,
    timeStamp 
  );
  
  const owners = await MnemonicQuery.collectionOwnersCount(
    contractAddress, 
    MnemonicQuery__RecordsDuration.thirtyDays,
    MnemonicQuery__DataTimeGroup.oneDay,
    timeStamp
  );
  

  prices.dataPoints.forEach(
    async (value, index) => {
      const dP = await findOrCreateDataPoint(collectionID, value.timestamp);

      if (!dP) return;
      await prisma.dataPoint.update({
        where: {
          id: dP.id
        },
        data: {
          avgPrice: value.avg,
          maxPrice: value.max,
          minPrice: value.min,
          tokensBurned: tokens.dataPoints[index]?.burned,
          tokensMinted: tokens.dataPoints[index]?.minted,
          totalBurned: tokens.dataPoints[index]?.totalBurned,
          totalMinted: tokens.dataPoints[index]?.totalMinted,
          salesCount: sales.dataPoints[index]?.count,
          salesVolume: sales.dataPoints[index]?.volume,
          ownersCount: owners.dataPoints[index]?.count
        }
      });
    }
  );

}

async function updateOrCreateRankTableEntry(collectionID: string, tableID: string, value: string) {
  
  const fromDb = await prisma.rankTableEntry.findUnique({
    where: {
      collectionId_tableId: {
        collectionId: collectionID,
        tableId: tableID
      }
    }, 
  });
  if (!fromDb) {
    const newEntry = await prisma.rankTableEntry.create({
      data: {
        collectionId: collectionID,
        tableId: tableID,
        value: value
      }
    });
  } else {
    const updated = await prisma.rankTableEntry.update({
      where: {
        id: fromDb.id
      },
      data: {
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

/**
 * To be run daily to refresh rankings
 */
export async function updateRankings() {

  //FOR TESTING
  // const boredApe = await findOrCreateCollection("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
  // if (!boredApe) return;
  // await populateDataPoints(boredApe.id, boredApe.address)
  // const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));


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

      for (let clctn of collections.collections) {
        const collection = await findOrCreateCollection(clctn.contractAddress);

          if (collection) {
            //Create the ranking.
            await updateOrCreateRankTableEntry(collection.id, rankTable.id, clctn.avgPrice || clctn.maxPrice || clctn.salesCount || clctn.salesVolume);
          }
      }
    }
  }
}

/**
 * To be run daily.
 */
export const refreshTimeSeries = async () => {
  const collections = await prisma.collection.findMany({});

  for (let clc of collections) {
    const earliest = new Date(Date.now())

    const timeStamp = new Date(earliest.getFullYear(), earliest.getMonth(), earliest.getDate()).toJSON();
    const prices = await MnemonicQuery.collectionPriceHistory(
      clc.address, 
      MnemonicQuery__RecordsDuration.oneDay,
      MnemonicQuery__DataTimeGroup.oneDay,
      timeStamp
    );
    
    const sales = await MnemonicQuery.collectionSalesVolume(
      clc.address, 
      MnemonicQuery__RecordsDuration.oneDay,
      MnemonicQuery__DataTimeGroup.oneDay,
      timeStamp 
    );
    
    const tokens = await MnemonicQuery.collectionTokensSupply(
      clc.address, 
      MnemonicQuery__RecordsDuration.oneDay,
      MnemonicQuery__DataTimeGroup.oneDay,
      timeStamp 
    );
    
    const owners = await MnemonicQuery.collectionOwnersCount(
      clc.address, 
      MnemonicQuery__RecordsDuration.oneDay,
      MnemonicQuery__DataTimeGroup.oneDay,
      timeStamp
    );
    
  
    prices.dataPoints.forEach(
      async (value, index) => {
        const dP = await findOrCreateDataPoint(clc.id, value.timestamp);
  
        if (!dP) return;
        await prisma.dataPoint.update({
          where: {
            id: dP.id
          },
          data: {
            avgPrice: value.avg,
            maxPrice: value.max,
            minPrice: value.min,
            tokensBurned: tokens.dataPoints[index]?.burned,
            tokensMinted: tokens.dataPoints[index]?.minted,
            totalBurned: tokens.dataPoints[index]?.totalBurned,
            totalMinted: tokens.dataPoints[index]?.totalMinted,
            salesCount: sales.dataPoints[index]?.count,
            salesVolume: sales.dataPoints[index]?.volume,
            ownersCount: owners.dataPoints[index]?.count
          }
        });
      }
    );
  }
}

export const dailyJob = async () => {
  const collections = await prisma.collection.count();

  if (collections > 0) {
    await refreshTimeSeries();
  }

  await updateRankings();
}