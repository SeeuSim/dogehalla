import * as MnemonicQuery from "./mnemonic";
import { MnemonicQuery__RankType, MnemonicQuery__RecordsDuration } from "./types";
import { prisma } from "server/db/client";

async function populateDb() {
  //#1 Get Ranking for avg, max, ct, vol
  //#2 For each of these, get ranking for 1D, 7D, 30D, 365D (top 125 only)
  //#3 Populate ranking table

  //#4 For each collection, retrieve datapoints for past 7D upon initialisation
  //   - Query for datapoints at 1h intervals (if we have a big enough database, 15min)
}