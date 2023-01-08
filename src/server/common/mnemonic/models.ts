import type { Collection, DataPoint, Prisma, RankTableEntry } from "@prisma/client";
import { prisma } from "server/db/client";

import * as MnemonicQuery from "./mnemonic";

import { 
  MnemonicQuery__DataTimeGroup, 
  MnemonicQuery__RankType, 
  MnemonicQuery__RecordsDuration, 
  MnemonicResponse__CollectionMeta__Metadata__Type 
} from "./types";

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
async function findOrCreateCollection(contractAddress: string) {
  //As this function also queries metadata and datapoints only on creation, 
  //`upsert` cannot be used.

  const collection = await prisma.collection.findUnique({
    where: {
      address: contractAddress
    }
  });

  if (collection != null) return collection;

  //Only query metadata on creation
  const meta = await MnemonicQuery.collectionMeta(contractAddress);


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
  timePeriod: MnemonicQuery__RecordsDuration = MnemonicQuery__RecordsDuration.thirtyDays, 
  grouping: MnemonicQuery__DataTimeGroup = MnemonicQuery__DataTimeGroup.oneDay
) {
  const current = new Date(Date.now());
  const timeStamp = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    // current.getHours()
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
      const [ownr, sls, tkn] = [owners.dataPoints[index], sales.dataPoints[index], tokens.dataPoints[index]];
      const data = {
        avgPrice: Boolean(prc.avg)? prc.avg : null,
        maxPrice: Boolean(prc.max)? prc.max : null,
        minPrice: Boolean(prc.min)? prc.min : null,
        salesVolume: Boolean(sls?.volume)? sls?.volume : null,
        tokensBurned: Boolean(tkn?.burned)? tkn?.burned : null,
        tokensMinted: Boolean(tkn?.minted)? tkn?.minted : null,
        totalBurned: Boolean(tkn?.totalBurned)? tkn?.totalBurned : null,
        totalMinted: Boolean(tkn?.totalMinted)? tkn?.totalMinted : null,
        ownersCount: BigInt(ownr?.count?? 0).valueOf(),
        salesCount: BigInt(sls?.count?? 0).valueOf(),
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

/**
 * A daily job.
 * 
 * To be run daily to refresh collection rankings, or seed an empty database.
 */
async function updateRankings() {

  //FOR TESTING
  // const boredApe = await findOrCreateCollection("0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D");
  // if (!boredApe) return;
  // await populateDataPoints(boredApe.id, boredApe.address)
  // const delay = (ms = 1000) => new Promise(r => setTimeout(r, ms));

  let rankingJobs: Prisma.Prisma__RankTableEntryClient<RankTableEntry, never>[] = [];

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
            const job = updateOrCreateRankTableEntry(collection.id, rankTable.id, clctn.avgPrice || clctn.maxPrice || clctn.salesCount || clctn.salesVolume);
            rankingJobs.push(job);
          }
      }
    }
  }
  await prisma.$transaction(rankingJobs);
}

/**
 * A daily job.
 * 
 * To be run daily to refresh the timeseries for existing collections in the 
 * database.
 */
const refreshTimeSeries = async () => {
  const collections = await prisma.collection.findMany();

  for (let clc of collections) {
    await populateDataPoints(
      clc.id,
      clc.address,
      MnemonicQuery__RecordsDuration.oneDay, //Duration
      MnemonicQuery__DataTimeGroup.oneDay //Grouping - To experiment with 1 Hour, or 15 Mins if database allows
    )
  }
}

/**
 * A daily or hourly job.
 * 
 * To retrieve the real time floor price for all collections in the database.
 */
const refreshFloorPrice = async () => {
  const collection = await prisma.collection.findMany();

  let jobs: Prisma.Prisma__CollectionClient<Collection, never>[] = [];
  for (let clc of collection) {
    const data = await MnemonicQuery.floorPrice(clc.address);
    const job = prisma.collection.update({
      where: {
        id: clc.id
      }, 
      data: {
        floor: data.price.totalNative?? 0
      }
    });
    jobs.push(job);
  }

  await prisma.$transaction(jobs);
}

/**
 * The function to be run daily to ensure the database is relevant with 
 * respect to the API and market conditions.
 */
export const dailyJob = async () => {

  const collections = await prisma.collection.count();

  if (collections > 0) {
    await refreshTimeSeries();
  }

  await updateRankings(); 
  await refreshFloorPrice();
}

