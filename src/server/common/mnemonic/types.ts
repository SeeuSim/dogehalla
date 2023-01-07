/**
 * The global Ethereum token types that Mnemonic classifies all returned 
 * collections under. This is in accordance with the Ethereum chain.
 */
enum MnemonicResponse__CollectionType {
  unknown = "TOKEN_TYPE_UNKNOWN",
  erc20 = "TOKEN_TYPE_ERC20",
  erc721 = "TOKEN_TYPE_ERC721",
  erc1155 = "TOKEN_TYPE_ERC1155",
  erc721Legacy = "TOKEN_TYPE_ERC721_LEGACY",
  cryptoPunks = "TOKEN_TYPE_CRYPTOPUNKS"
}

/**
 * The global time grouping for Mnemonic's time-series endpoints:
 * - Owner Count
 * - Pricing
 * - Sales Volume
 * - Token Supply
 */
export enum MnemonicQuery__DataTimeGroup {
  unspecified = "GROUP_BY_PERIOD_UNSPECIFIED",
  fifteenMin = "GROUP_BY_PERIOD_15_MINUTES",
  oneHour = "GROUP_BY_PERIOD_1_HOUR",
  oneDay = "GROUP_BY_PERIOD_1_DAY"
}

/**
 * The global duration types that Mnemonic allows for its collections related
 * data.
 */
export enum MnemonicQuery__RecordsDuration {
  // unspecified = "DURATION_UNSPECIFIED",
  oneDay = "DURATION_1_DAY",
  sevenDays = "DURATION_7_DAYS",
  thirtyDays = "DURATION_30_DAYS",
  oneYear = "DURATION_365_DAYS"
}

/**
 * The metadata tags that Mnemonic provides for its collections under the 
 * metadata endpoint.
 * 
 * @CollectionsMeta
 */
export enum MnemonicResponse__CollectionMeta__Metadata__Type {
  bannerImage = "TYPE_BANNER_IMAGE_URL", 
  description = "TYPE_DESCRIPTION", 
  image = "TYPE_IMAGE_URL", 
  discord = "TYPE_DISCORD_URL", 
  extURL = "TYPE_EXTERNAL_URL", 
  mediumUsn = "TYPE_MEDIUM_USERNAME",
  teleUsn = "TYPE_TELEGRAM_URL", 
  twitterUsn = "TYPE_TWITTER_USERNAME", 
  instaUsn = "TYPE_INSTAGRAM_USERNAME", 
  wikiUsn = "TYPE_WIKI_URL"
}

/**
 * The response type for the collections metadata Mnemonic endpoint.
 * 
 * @CollectionsMeta
 */
export type MnemonicResponse__CollectionMeta = {
  types: Array<MnemonicResponse__CollectionType>,
  name: string,
  tokensCount: string,
  ownersCount: string,
  salesVolume: string,
  metadata: Array<{
    type: MnemonicResponse__CollectionMeta__Metadata__Type,
    value: string
  }>
}

/**
 * The different rankings that Mnemonic provides for its collections ranking 
 * endpoint.
 * 
 * @CollectionsRank
 */
export enum MnemonicQuery__RankType {
  avgPrice = "avg_price",
  maxPrice = "max_price",
  salesCount = "sales_count",
  salesVolume = "sales_volume"
};

/**
 * The unique value keys Mnemonic provides in its response for the collections
 * ranking endpoint.
 * 
 * @CollectionsRank
 */
type MnemonicResponse__Rank__Response = { avgPrice: string } & { maxPrice: string } & { salesCount: string } & { salesVolume: string };

/**
 * The response type Mnemonic provides for its `Top Collections by` endpoint.
 * 
 * @CollectionsRank
 */
export type MnemonicResponse__Rank = {
  collections: Array<{
    contractAddress: string,
    contractName: string
  } & MnemonicResponse__Rank__Response>
}

export type MnemonicResponse__PriceHistory = {
  dataPoints: Array<{
    timestamp: string,
    min: string,
    max: string,
    avg: string
  }>
}

export type MnemonicResponse__SalesVolume = {
  dataPoints: Array<{
    timestamp: string,
    count: string,
    volume: string
  }>
}

export type MnemonicResponse__TokensSupply = {
  dataPoints: Array<{
    timestamp: string,
    minted: string,
    burned: string,
    totalMinted: string,
    totalBurned: string
  }>
}

export type MnemonicResponse__OwnersCount = {
  dataPoints: Array<{
    timestamp: string,
    count: string
  }>
}
