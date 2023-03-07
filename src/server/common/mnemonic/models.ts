import { Collection, DataPoint, Prisma, PrismaClient, RankTableEntry } from "@prisma/client";
import { refreshFloor } from "../gallop/gallop";
import { updateGallopRankings } from "../gallop/models";

import * as MnemonicQuery from "./mnemonic";

import { MnemonicQuery__DataTimeGroup, MnemonicQuery__RankType, MnemonicQuery__RecordsDuration, MnemonicResponse__CollectionMeta__Metadata__Type } from "./types";

//ONLY FOR THIS FILE
const prisma = new PrismaClient({
  log: ["error", "warn"]
});
const maxInt = Math.pow(2, 62);

/**
 * Given an Ethereum contract address, retrieves the associated collection from
 * the database, OR:
 * 
 * Queries the Mnemonic API and populates the database with the associated
 * collection and its metadata, along with the past thirty days of time series 
 * data, and finally returns the collection record.
 * 
 * @param contractAddress The desired Ethereum contract address.
 * @returns The collection from the database.
 */
export async function findOrCreateCollection(contractAddress: string) {
  //As this function also queries datapoints only on creation, 
  //`upsert` cannot be used.
  
  const meta = await MnemonicQuery.collectionMeta(contractAddress);

  const collection = await prisma.collection.findUnique({
    where: {
      address: contractAddress
    }
  });
  
  const bannerImg = meta.metadata.find(
    val => val.type === MnemonicResponse__CollectionMeta__Metadata__Type.bannerImage
  );

  const img = meta.metadata.find(
    val => val.type === MnemonicResponse__CollectionMeta__Metadata__Type.image
  );

  const desc = meta.metadata.find(
    val => val.type === MnemonicResponse__CollectionMeta__Metadata__Type.description
  );

  const exturl = meta.metadata.find(
    val => val.type === MnemonicResponse__CollectionMeta__Metadata__Type.extURL
  );
  
  //Highly likely to be a bogus collection if all three are missing, and there are few owners
  if (!Boolean(meta.name) && !Boolean(desc) && !Boolean(exturl) && new Number(meta.ownersCount) <= 5) return null; 
  
  if (collection != null) {
    const updated = await prisma.collection.update({
      where: {
        id: collection.id
      },
      data: {
        tokens: new Number(meta.tokensCount?? 0).valueOf(),
        owners: new Number(meta.ownersCount?? 0).valueOf(),
        salesVolume: Boolean(meta.salesVolume)? meta.salesVolume : 0,
      }
    });
    return updated;
  }
  
  try {
    const newCollection = await prisma.collection.create({
      data: {
        address: contractAddress,
        name: meta.name,
        type: meta.types.join(" "),
        tokens: new Number(meta.tokensCount?? 0).valueOf(),
        owners: new Number(meta.ownersCount?? 0).valueOf(),
        salesVolume: Boolean(meta.salesVolume)? meta.salesVolume : 0,
        bannerImg: bannerImg?.value?? "",
        image: img?.value?? "",
        description: desc?.value?? "",
        extURL: exturl?.value,
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

/**
 * Given a collection, populates the datapoints for the collection, with a 
 * default of the past thirty days.
 * 
 * @param collectionID The parent collection's database ID
 * @param contractAddress The parent collection's contract address.
 * @param timePeriod The timeperiod for which to query.
 * @param grouping How closely the datapoints should be grouped.
 */
async function populateDataPoints(
  collectionID: string, 
  contractAddress: string, 
  timePeriod: MnemonicQuery__RecordsDuration = MnemonicQuery__RecordsDuration.oneYear, 
  grouping: MnemonicQuery__DataTimeGroup = MnemonicQuery__DataTimeGroup.oneDay
) {
  const current = new Date(Date.now());

  //Set to previous day T00:00 - current day T00:00 is not avail
  const timeStamp = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate() + 1,
    -1 * Math.round(current.getTimezoneOffset()/60),
  ).toJSON();
  
  const prices = await MnemonicQuery.collectionPriceHistory(
    contractAddress, 
    timePeriod,
    grouping,
    timeStamp
  );
  
  const sales = await MnemonicQuery.collectionSalesVolume(
    contractAddress, 
    timePeriod,
    grouping,
    timeStamp 
  );
  
  const tokens = await MnemonicQuery.collectionTokensSupply(
    contractAddress, 
    timePeriod,
    grouping,
    timeStamp 
  );
  
  const owners = await MnemonicQuery.collectionOwnersCount(
    contractAddress, 
    timePeriod,
    grouping,
    timeStamp
  );
  
  let jobs: Prisma.Prisma__DataPointClient<DataPoint, never>[] = [];
  
  prices.dataPoints.forEach(
    async (prc, index) => {
      const data = {
        avgPrice: Boolean(prc.avg)? prc.avg : 0,
        maxPrice: Boolean(prc.max)? prc.max : 0,
        minPrice: Boolean(prc.min)? prc.min : 0,
      };

      const job = prisma.dataPoint.upsert({
        where: {
          collectionId_timestamp: {
            collectionId: collectionID,
            timestamp: prc.timestamp
          }
        },
        update: data,
        create: {
          collectionId: collectionID,
          timestamp: prc.timestamp,
          ...data
        }
      });
      jobs.push(job);
    }
  );
  
  sales.dataPoints.forEach(
    async (sls, index) => {
      const data = {
        salesVolume: Boolean(sls?.volume)? sls?.volume : 0,
        salesCount: Math.min(new Number(sls?.quantity?? 0).valueOf(), maxInt),
      };
      const job = prisma.dataPoint.upsert({
        where: {
          collectionId_timestamp: {
            collectionId: collectionID,
            timestamp: sls.timestamp
          }
        },
        update: data,
        create: {
          collectionId: collectionID,
          timestamp: sls.timestamp,
          ...data
        }
      });
      jobs.push(job);
    }
  )

  owners.dataPoints.forEach(
    async (ownr, index) => {
      const data = {
        ownersCount: Math.min(new Number(ownr?.count?? 0).valueOf(), maxInt),
      };

      const job = prisma.dataPoint.upsert({
        where: {
          collectionId_timestamp: {
            collectionId: collectionID,
            timestamp: ownr.timestamp
          }
        },
        update: data,
        create: {
          collectionId: collectionID,
          timestamp: ownr.timestamp,
          ...data
        }
      });
      jobs.push(job);
    }
  )

  tokens.dataPoints.forEach(
    async (tkn, index) => {
      const data = {
        tokensBurned: Boolean(tkn?.burned)? tkn?.burned : 0,
        tokensMinted: Boolean(tkn?.minted)? tkn?.minted : 0,
        totalBurned: Boolean(tkn?.totalBurned)? tkn?.totalBurned : 0,
        totalMinted: Boolean(tkn?.totalMinted)? tkn?.totalMinted : 0,
      };

      const job = prisma.dataPoint.upsert({
        where: {
          collectionId_timestamp: {
            collectionId: collectionID,
            timestamp: tkn.timestamp
          }
        },
        update: data,
        create: {
          collectionId: collectionID,
          timestamp: tkn.timestamp,
          ...data
        }
      });
      jobs.push(job);
    }
  )

  await prisma.$transaction(jobs);
}

/**
 * Returns a transaction that updates an existing ranking entry, or creates a new one.
 * 
 * @param collectionID The parent collection.
 * @param tableID The parent ranking table.
 * @param value The ranking value to be updated.
 * @returns The transaction that retrieves an entry from the database.
 */
function updateOrCreateRankTableEntry(collectionID: string, tableID: string, value: string) {
  const data = { value: value };
  return prisma.rankTableEntry.upsert({
    where: {
      collectionId_tableId: {
        collectionId: collectionID,
        tableId: tableID
      }
    },
    update: data,
    create: {
      collectionId: collectionID,
      tableId: tableID,
      ...data
    }
  });
}

/**
 * Retrieves or creates a ranking table to rank collections in the database.
 * 
 * @param rank The desired ranking metric. 
 * @param timePeriod The time period for which that metric is valid.
 * @returns The table used to rank the collections by that metric.
 */
async function findOrCreateRankTable(rank: MnemonicQuery__RankType, timePeriod: MnemonicQuery__RecordsDuration) {
  const out = await prisma.rankTable.upsert({
    where: {
      type_timePeriod: {
        type: MnemonicQuery.RankMapping[rank],
        timePeriod: MnemonicQuery.TimeRanking[timePeriod]
      }
    },
    update: {},
    create: {
      type: MnemonicQuery.RankMapping[rank],
      timePeriod: MnemonicQuery.TimeRanking[timePeriod]
    }
  })

  return out;
}

async function rankTimeUpdate(rank: MnemonicQuery__RankType, time: MnemonicQuery__RecordsDuration) {
  try {
    let rankingJobs: Prisma.Prisma__RankTableEntryClient<RankTableEntry, never>[] = [];
    const rankTable = await findOrCreateRankTable(rank, time);
    const { count } = await prisma.rankTableEntry.deleteMany({
      where: {
        tableId: rankTable.id
      }
    });

    //Query data
    const collections = await MnemonicQuery.getTopCollections(rank, time);
   
    console.log("================================================================================");
    console.log(`== Refreshing ${rank} ${time} Rankings for ${collections.collections.length} collections ==`);
    console.log("================================================================================");
    let ct = 1;

    for (let clctn of collections.collections) {
      const collection = await findOrCreateCollection(clctn.collection.contractAddress);

      if (collection) {
        //Create the ranking.
        console.log(`${ct}. ${collection.name || collection.address}`)
        const job = updateOrCreateRankTableEntry(collection.id, rankTable.id, clctn.metricValue);
        rankingJobs.push(job);
        ct += 1;
      }
    }
    console.log("Pushing to database...")
    await prisma.$transaction(rankingJobs);
    console.log("Successful!");
    return true; 
  } catch (err) {
    return false;
  }
}

/**
 * A daily job.
 * 
 * To be run daily to refresh collection rankings, or seed an empty database.
 */
async function updateRankings() { 
  // For `avg_price`, `max_price`
  for (let rank of Object.values(MnemonicQuery__RankType)) {
    for (let time of Object.values(MnemonicQuery__RecordsDuration)) {
      let jobSucceeded = false;
      while (!jobSucceeded) {
        jobSucceeded = await rankTimeUpdate(rank, time);
      }
    }
  }
  
  await updateGallopRankings();

  console.log("==========>> Rankings Refreshed!")
}

/**
 * A daily job.
 * 
 * To be run daily to refresh the timeseries for existing collections in the 
 * database.
 */
const refreshTimeSeries = async () => {
  const collections = await prisma.collection.findMany();
  
  let errors = [];
  console.log("////////////////////////////////////////////////")
  console.log("//////////////Refreshing TIMESERIES/////////////")
  console.log(`//////////////Awaiting ${collections.length} collections////////`)
  console.log("////////////////////////////////////////////////")
  let ct = 1;
  for (let clc of collections) {
    console.log(`${ct}. ${clc.name || clc.address}`)
    try {
    await populateDataPoints(
      clc.id,
      clc.address,
      MnemonicQuery__RecordsDuration.sevenDays, //Duration
      MnemonicQuery__DataTimeGroup.oneDay //Grouping - To experiment with 1 Hour, or 15 Mins if database allows
    )
    } catch(err) {
      errors.push(clc.name || clc.address)
    }
    ct += 1
  }
  console.log("=====>> TimeSeries Refreshed!! :)")
  if (!errors.length) return;
  console.log("ERRORS: ")
  errors.forEach(console.log);
}

/**
 * A daily or hourly job.
 * 
 * To retrieve the real time floor price for all collections in the database.
 */
const refreshFloorPrice = async () => {
  const collection = await prisma.collection.findMany();
  console.log(`////////////////Refreshing Floor Price for ${collection.length} Collections`)

  let jobs: Prisma.Prisma__CollectionClient<Collection, never>[] = [];
  let ct = 1;
  for (let clc of collection) {
    console.log(`${ct}. ${clc.name || clc.address}`)
    let data;
    try {
      data = await MnemonicQuery.floorPrice(clc.address);
    } catch (err) {
      data = await MnemonicQuery.floorPrice(clc.address);
    }
    const job = prisma.collection.update({
      where: {
        id: clc.id
      }, 
      data: {
        floor: data.price?.totalNative?? 0
      }
    });
    jobs.push(job);
    ct += 1;
  }
  console.log("Pushing to database...")
  await prisma.$transaction(jobs);
  console.log("=======>> Floor Price refreshed! :)")
}

/**
 * The function to be run daily to ensure the database is relevant with 
 * respect to the API and market conditions.
 */
export const dailyJob = async () => {
  // await updateRankings();
  await refreshFloor();

  const collections = await prisma.collection.count();
  if (collections > 0) {
    await refreshTimeSeries();
  }
}
