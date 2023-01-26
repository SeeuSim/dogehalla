import { Prisma, RankTableEntry } from "@prisma/client";

import { prisma } from "server/db/client";

import { RankMapping, TimeRanking, TopCollection } from "./gallop";
import { GallopRankingPeriod, GallopRankMetric } from "./types";

import { findOrCreateCollection } from "../mnemonic/models";

async function upsertCollection(address: string, name: string) {
  const collection = await findOrCreateCollection(address);
  if (collection && name) {
    const updated = await prisma.collection.update({
      where: {
        address: collection?.address
      },
      data: {
        name: name
      }
    });
    return updated;
  }
  return collection;
}

async function findOrCreateRankTable(rank: GallopRankMetric, time: GallopRankingPeriod) {
  const out = await prisma.rankTable.upsert({
    where: {
      type_timePeriod: {
        type: RankMapping[rank],
        timePeriod: TimeRanking[time]
      }
    },
    update: {},
    create: {
      type: RankMapping[rank],
      timePeriod: TimeRanking[time]
    }
  });
  return out;
}

async function upsertRankTableEntry(collectionID: string, tableID: string, value: string) {
  const data = { value: value};
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

async function rankTimeUpdate(rank: GallopRankMetric, time: GallopRankingPeriod) {
  try {
    let rankingJobs: Prisma.Prisma__RankTableEntryClient<RankTableEntry, never>[] = [];
    const rankTable = await findOrCreateRankTable(rank, time);
    const { count } = await prisma.rankTableEntry.deleteMany({
      where: {
        tableId: rankTable.id
      }
    });

    //Query data
    const resp = await TopCollection(rank, time);

    console.log("================================================================================");
    console.log(`== Refreshing ${rank} ${time} Rankings for ${resp.response.leaderboard.length} collections ==`);
    console.log("================================================================================");
    
    let ct = 1;
    for (let entry of resp.response.leaderboard) {
      const collection = await upsertCollection(entry.collection_address, entry.collection_name);

      if (collection) {
        console.log(`${ct}. ${entry.collection_name}`)
        const job = upsertRankTableEntry(collection.id, rankTable.id, entry.value.toString());
        ct += 1;
      }
    }
    console.log("Pushing to database...");
    await prisma.$transaction(rankingJobs);
    console.log("Successful! :)");
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function updateGallopRankings() {
  console.log("Gallop Rankings");
  
  for (let rank of Object.values(GallopRankMetric)) {
    for (let time of Object.values(GallopRankingPeriod)) {
      let jobSucceeded = false;
      while (!jobSucceeded) {
        jobSucceeded = await rankTimeUpdate(rank, time);
      }
    }
  }
}