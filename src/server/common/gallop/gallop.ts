import { env } from "env/server.mjs";
import { prisma } from "server/db/client";
import { Prisma, Collection, CollectionsRank, RankPeriod } from "@prisma/client";

import { type GallopFloorResponse, type GallopFloorCollections, GallopRankMetric, GallopRankingPeriod, type GallopRankResponse } from "./types";

export const RankMapping = {
  "sales_count": CollectionsRank.salesCount,
  "eth_volume": CollectionsRank.salesVolume
};

export const TimeRanking = {
  'one_day': RankPeriod.oneDay,
  'seven_days': RankPeriod.sevenDays,
  'thirty_days': RankPeriod.thirtyDays,
  'ninety_days': RankPeriod.ninetyDays,
  'all_time': RankPeriod.allTime
}

export async function floorPrice(contractAddresses: Array<string>, page: number = 1) {
  const url = "https://api.prod.gallop.run/v1/data/eth/getMarketplaceFloorPrice"
  const data = {
    collection_address: contractAddresses,
    page_size: 1000,
    page: page
  };

  return await fetch(url, {
    method: "POST",
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-api-key': env.GALLOP_API_KEY
    },
    body: JSON.stringify(data)
  })
  .then(
    (response) => {
      if (response.status != 200) {
        console.log(response.status);
      }
      return response.json() as Promise<GallopFloorResponse>
    }
  );
}

async function batchRequest(addresses: string[], ct: number = 1) {
  const resp = await floorPrice(addresses);
  let jobs: Prisma.Prisma__CollectionClient<Collection, never>[] = [];
  const updateJob = async (point: GallopFloorCollections) => {
    console.log(`${ct}. ${point.collection_address}`);
    const contractAddress = point.collection_address;
    let minFloor = Number.MAX_SAFE_INTEGER;
    point.marketplaces.forEach((slug) => {
      minFloor = Math.min(minFloor, slug.floor_price);
    });
    jobs.push(prisma.collection.update({
      where: {
        address: contractAddress
      }, 
      data: {
        floor: minFloor
      }
    }));
    ct += 1;
  };
  resp.response.collections.forEach(updateJob);
  return jobs;
}

export async function refreshFloor() {
  const collections = await prisma.collection.findMany({
    select: {
      address: true
    }
  }).then(data => {
    return data.map(clc => clc.address);
  });

  console.log(`Awaiting ${collections.length} Collections`);
  let jobs: Prisma.Prisma__CollectionClient<Collection, never>[] = [];
  for (let i = 0; i < collections.length; i = i + 1000) {
    jobs.concat(await batchRequest(collections.slice(i, i + 1000), i + 1));
  }

  console.log("Pushing to database...");
  await prisma.$transaction(jobs);
  console.log("Floor price refreshed :)");
}

export async function TopCollection(rank: GallopRankMetric, time: GallopRankingPeriod) {
  const url = "https://api.prod.gallop.run/v1/analytics/eth/getLeaderBoard";
  const params = {
    interval: time as string,
    ranking_metric: rank as string,
    page_size: 100
  };

  return await fetch(url, {
    method: "POST",
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'x-api-key': env.GALLOP_API_KEY
    },
    body: JSON.stringify(params)
  })
  .then(
    (response) => {
      if (response.status != 200) {
        console.log(response.status);
      }
      return response.json() as Promise<GallopRankResponse>
    }
  );
}
