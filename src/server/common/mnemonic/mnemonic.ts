import { env } from "../../../env/server.mjs";
import { prisma } from "../../db/client";

import type { 
  MnemonicQuery__DataTimeGroup,
  MnemonicQuery__RankType,
  MnemonicQuery__RecordsDuration,
  MnemonicResponse__CollectionMeta,
  MnemonicResponse__Rank,
  MnemonicResponse__PriceHistory,
  MnemonicResponse__OwnersCount,
  MnemonicResponse__SalesVolume,
  MnemonicResponse__TokensSupply,
} from "./types";

// THIS SHOULD ONLY RESIDE ON THE SERVER

const MNEMONIC_AUTH_HEADER = {
  'X-API-Key': env.MNEMONIC_API_KEY
};

/**
 * Given a 42-character Ethereum contract address, returns the metadata from the Mnemonic API.
 * 
 * @CollectionsMeta
 * 
 * @param contractAddress The contract address of the collection for which to retrieve the metadata.
 * @returns The contract metadata.
 */
export async function collectionMeta(contractAddress: string) {
  return await fetch(
    `https://ethereum.rest.mnemonichq.com/contracts/v1beta1/nft/metadata/${contractAddress}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    }
  )
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<MnemonicResponse__CollectionMeta>;
  });
}

/**
 * Given a ranking metric and a time period, retrieves the top 500 collections from the Mnemonic API
 * 
 * @CollectionsRank
 * 
 * @param rank        The desired metric by which to get the top 500 collections. 
 * @param timePeriod  The time period for which the ranking is obtained.
 * @param limit       The amount of collections to receive, up to a maximum of `"500"`.
 * @param offset      The offset by which to retrieve the collections. Default: `"0"`
 * 
 * @returns A list of collections ranked in descending order by the time period and metric, 
 * wrapped in an object.
 */
export async function getTopCollections(
    rank: MnemonicQuery__RankType, 
    timePeriod: MnemonicQuery__RecordsDuration,
    limit: string = '500',
    offset: string= '0'
  ) {
  
  const query = new URLSearchParams({
    limit: limit,
    offset: offset,
    duration: timePeriod.toString()
  }).toString();

  return await fetch(
    `https://ethereum.rest.mnemonichq.com/collections/v1beta1/top/by_${rank}?${query}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    }
  )
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<MnemonicResponse__Rank>;
  });
}

/**
 * Given a collection's contract address, a time period for which to 
 * query, and a grouping for the returned time series points, returns 
 * the pricing time series for that collection.
 * 
 * @param contractAddress The collection address for which to query.
 * @param timePeriod      The time period for which to query.
 * @param groupBy         The groupings of the time series entries to return. 
 *                        For `15_MINUTES`, it is only available for the 
 *                        timePeriod of `1_DAY`.
 *                        For `1_HOUR`, it is only available for the timePeriod 
 *                        of `7_DAYS` and below.
 * @param timeStampLt     The latest timestamp time series to be provided. To 
 *                        provide another time, use the 
 *                        `<YYYY>-<MM>-<DD>T<hh>:<mm>:<ss>:<mse>Z` format.
 * 
 * @returns The price history time series.
 */
export async function collectionPriceHistory(
  contractAddress: string, 
  timePeriod: MnemonicQuery__RecordsDuration, 
  groupBy: MnemonicQuery__DataTimeGroup,
  timeStampLt: string = new Date(Date.now()).toJSON()
) {
  const query = new URLSearchParams({
    duration: timePeriod.toString(),
    timestampLt: timeStampLt,
    groupByPeriod: groupBy.toString()
  }).toString();

  return await fetch(
    `https://ethereum.rest.mnemonichq.com/pricing/v1beta1/prices/by_contract/${contractAddress}?${query}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    }
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<MnemonicResponse__PriceHistory>;
  });
}

/**
 * Given a collection's contract address, a time period for which to 
 * query, and a grouping for the returned time series points, returns 
 * the sales volume time series for that collection.
 * 
 * @param contractAddress The collection address for which to query.
 * @param timePeriod      The time period for which to query.
 * @param groupBy         The groupings of the time series entries to return. 
 *                        For `15_MINUTES`, it is only available for the 
 *                        timePeriod of `1_DAY`.
 *                        For `1_HOUR`, it is only available for the timePeriod 
 *                        of `7_DAYS` and below.
 * @param timeStampLt     The latest timestamp time series to be provided. To 
 *                        provide another time, use the 
 *                        `<YYYY>-<MM>-<DD>T<hh>:<mm>:<ss>:<mse>Z` format.
 * 
 * @returns The sales volume time series.
 */
export async function collectionSalesVolume(
  contractAddress: string, 
  timePeriod: MnemonicQuery__RecordsDuration, 
  groupBy: MnemonicQuery__DataTimeGroup,
  timeStampLt: string = new Date(Date.now()).toJSON()
) {
  const query = new URLSearchParams({
    duration: timePeriod.toString(),
    timestampLt: timeStampLt,
    groupByPeriod: groupBy.toString()
  }).toString();

  return await fetch(
    `https://ethereum.rest.mnemonichq.com/pricing/v1beta1/volumes/by_contract/${contractAddress}?${query}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    }
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<MnemonicResponse__SalesVolume>;
  });
}

/**
 * Given a collection's contract address, a time period for which to 
 * query, and a grouping for the returned time series points, returns 
 * the token supply time series for that collection.
 * 
 * @param contractAddress The collection address for which to query.
 * @param timePeriod      The time period for which to query.
 * @param groupBy         The groupings of the time series entries to return. 
 *                        For `15_MINUTES`, it is only available for the 
 *                        timePeriod of `1_DAY`.
 *                        For `1_HOUR`, it is only available for the timePeriod 
 *                        of `7_DAYS` and below.
 * @param timeStampLt     The latest timestamp time series to be provided. To 
 *                        provide another time, use the 
 *                        `<YYYY>-<MM>-<DD>T<hh>:<mm>:<ss>:<mse>Z` format.
 * 
 * @returns The token supply time series.
 */
export async function collectionTokensSupply(
  contractAddress: string, 
  timePeriod: MnemonicQuery__RecordsDuration, 
  groupBy: MnemonicQuery__DataTimeGroup,
  timeStampLt: string = new Date(Date.now()).toJSON()
) {
  const query = new URLSearchParams({
    duration: timePeriod.toString(),
    timestampLt: timeStampLt,
    groupByPeriod: groupBy.toString()
  }).toString();

  return await fetch(
    `https://ethereum.rest.mnemonichq.com/collections/v1beta1/supply/by_contract/${contractAddress}?${query}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    }
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<MnemonicResponse__TokensSupply>;
  });
}

/**
 * Given a collection's contract address, a time period for which to 
 * query, and a grouping for the returned time series points, returns 
 * the owners count time series for that collection.
 * 
 * @param contractAddress The collection address for which to query.
 * @param timePeriod      The time period for which to query.
 * @param groupBy         The groupings of the time series entries to return. 
 *                        For `15_MINUTES`, it is only available for the 
 *                        timePeriod of `1_DAY`.
 *                        For `1_HOUR`, it is only available for the timePeriod 
 *                        of `7_DAYS` and below.
 * @param timeStampLt     The latest timestamp time series to be provided. To 
 *                        provide another time, use the 
 *                        `<YYYY>-<MM>-<DD>T<hh>:<mm>:<ss>:<mse>Z` format.
 * 
 * @returns The owners count time series.
 */
export async function collectionOwnersCount(
  contractAddress: string, 
  timePeriod: MnemonicQuery__RecordsDuration, 
  groupBy: MnemonicQuery__DataTimeGroup,
  timeStampLt: string = new Date(Date.now()).toJSON()
) {
  const query = new URLSearchParams({
    duration: timePeriod.toString(),
    timestampLt: timeStampLt,
    groupByPeriod: groupBy.toString()
  }).toString();

  return await fetch(`https://ethereum.rest.mnemonichq.com/collections/v1beta1/owners_count/${contractAddress}?${query}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    }
  )
  .then(response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json() as Promise<MnemonicResponse__OwnersCount>;
  });
}

