import { env } from "env/server.mjs";

import { CollectionsRank, RankPeriod } from "@prisma/client";

import { 
  MnemonicQuery__DataTimeGroup,
  MnemonicQuery__RankType,
  MnemonicQuery__RecordsDuration,
  MnemonicResponse__CollectionMeta,
  MnemonicResponse__Rank,
  MnemonicResponse__PriceHistory,
  MnemonicResponse__OwnersCount,
  MnemonicResponse__SalesVolume,
  MnemonicResponse__TokensSupply,
  MnemonicQuery__Marketplaces,
  MnemonicResponse__FloorPrice,
} from "./types";

// THIS SHOULD ONLY RESIDE ON THE SERVER

/**
 * Provides a native time delay, mainly for async fetching from external APIs.
 * As certain APIs (such as Mnemonic) may be rate limited, inserting this
 * function before any fetch call will prevent the likelihood of HTTP 429 
 * rate limiting errors for batched fetch calls.
 * 
 * This is set to the base delay of 40ms to avoid exceeding Mnemonic's hard 
 * limit of 30 calls per second.
 * 
 * @param ms The desired delay in milliseconds
 * @returns A `Promise<void>` that contains nothing. To activate the delay, 
 * simply `await` this function before your fetch call.
 */
const delay = (ms = 40) => new Promise(r => setTimeout(r, ms));

const MNEMONIC_AUTH_HEADER = {
  'X-API-Key': env.MNEMONIC_API_KEY??""
};

export const RankMapping = {
  "avg_price": CollectionsRank.avgPrice,
  "max_price": CollectionsRank.maxPrice
};

export const TimeRanking = {
  'DURATION_1_DAY': RankPeriod.oneDay,
  'DURATION_7_DAYS': RankPeriod.sevenDays,
  'DURATION_30_DAYS': RankPeriod.thirtyDays,
  'DURATION_365_DAYS': RankPeriod.oneYear
}

/**
 * Given a 42-character Ethereum contract address, returns the metadata from the Mnemonic API.
 * 
 * @CollectionsMeta
 * 
 * @param contractAddress The contract address of the collection for which to retrieve the metadata.
 * @returns The contract metadata.
 */
export async function collectionMeta(contractAddress: string) {
  const __ = await delay();
  return await fetch(
    `https://ethereum-rest.api.mnemonichq.com/collections/v1beta2/${contractAddress}/metadata?includeStats=true`,
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
 * Given a ranking metric and a time period, retrieves the top 20 collections from the Mnemonic API
 * 
 * @CollectionsRank
 * 
 * @param rank        The desired metric by which to get the top 20 collections. 
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
    limit: string = '100',
    offset: string= '0'
  ) {
  
  const query = new URLSearchParams({
    limit: limit,
    offset: offset
  }).toString();

  const __ = await delay();
  return await fetch(
    `https://ethereum-rest.api.mnemonichq.com/collections/v1beta2/top/METRIC_${rank.toUpperCase()}/${timePeriod}?${query}`,
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
    timestampLt: timeStampLt
  }).toString();

  const __ = await delay();
  return await fetch(
      `https://ethereum-rest.api.mnemonichq.com/collections/v1beta2/${contractAddress}/prices/${timePeriod}/${groupBy}?${query}`,
      {
        method: 'GET',
        headers: MNEMONIC_AUTH_HEADER
      }
    )
    
    .then(response => {
      if (!response.ok) {
        console.log(`Prices ${response.statusText}`)
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
    timestampLt: timeStampLt
  }).toString();

  const __ = await delay();
  return await fetch(
    `https://ethereum-rest.api.mnemonichq.com/collections/v1beta2/${contractAddress}/sales_volume/${timePeriod}/${groupBy}?${query}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    }
  )
  .then(response => {
    if (!response.ok) {
      console.log(`Sales ${response.statusText}`)
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
    timestampLt: timeStampLt
  }).toString();

  const __ = await delay();
  return await fetch(
    `https://ethereum-rest.api.mnemonichq.com/collections/v1beta2/${contractAddress}/supply/${timePeriod}/${groupBy}?${query}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    }
  )
  .then(response => {
    if (!response.ok) {
      console.log(`Tokens + ${response.statusText} + ${response.status}`);
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

  const __ = await delay();
  return await fetch(`https://ethereum-rest.api.mnemonichq.com/collections/v1beta2/${contractAddress}/owners_count/${timePeriod}/${groupBy}?${query}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    }
  )
  
  .then(async (response) => {
    if (!response.ok) {
      console.log(`Owners ${response.statusText}`)
    }
    return response.json() as Promise<MnemonicResponse__OwnersCount>;
  });
}

/**
 * Given a contract address, retrieves the floor price for that address.
 * @param contractAddress The desired contract address to query for.
 * @param tokenID The optional NFT to query for.
 * @param marketplace The optional marketplace to query for.
 * @returns The floor price, in both native ERC20 Ethereum as well as USD.
 */
export async function floorPrice(contractAddress: string, tokenID?: string, marketplace?: MnemonicQuery__Marketplaces) {
  let params;
  if (marketplace || tokenID) {
    if (marketplace && tokenID) {
      params = new URLSearchParams({
        tokenId: tokenID,
        marketplaceId: marketplace as string
      }).toString();
    } else {
      params = new URLSearchParams(
        tokenID
        ? {
          tokenId: tokenID
        }
        : {
          marketplaceId: marketplace as string
        }
      ).toString();
    }
  }
  return await fetch(`https://ethereum-rest.api.mnemonichq.com/marketplaces/v1beta2/floors/${contractAddress}${params? `?${params}`:""}`,
    {
      method: 'GET',
      headers: MNEMONIC_AUTH_HEADER
    })
    .then(
      (response) => {
        if (!response.ok) {
          console.log(response.statusText);
        }
        return response.json() as Promise<MnemonicResponse__FloorPrice>
      }
    );
}
