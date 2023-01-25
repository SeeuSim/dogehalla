import { env } from "env/server.mjs";
import { prisma } from "server/db/client";
import type { Prisma, Collection } from "@prisma/client";

type GallopFloorResponse = {
  status: number,
  response: GallopFloorResponseData 
};

type GallopFloorResponseData = {
  total_items: number,
  total_pages: number,
  page: number,
  collections: Array<GallopFloorCollections>
};

type GallopFloorCollections = {
  collection_address: string,
  marketplaces: Array<GallopFloorCollections__MarketPlaceSlug>
}

type GallopFloorCollections__MarketPlaceSlug = {
  updated_at: string,
  floor_price: number,
  marketplace: string,
  collection_id: string,
  sub_collection_tag: string
};

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

export async function refreshFloor() {
  const collections = await prisma.collection.findMany({
    select: {
      address: true
    }
  }).then(data => {
    return data.map(clc => clc.address);
  });
  const resp = await floorPrice(collections);

  console.log(`Awaiting ${resp.response.collections.length} Collections`);

  const pages = resp.response.total_pages;
  let ct = 1;
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

  let pageNum = resp.response.page;
  while (pageNum < pages) {
    pageNum += 1;
    const newResp = await floorPrice(collections, pageNum);
    newResp.response.collections.forEach(updateJob);
  }

  console.log("Pushing to database...");
  await prisma.$transaction(jobs);
  console.log("Floor price refreshed :)");
}