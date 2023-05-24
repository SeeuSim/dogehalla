export type GallopFloorResponse = {
  status: number,
  response: GallopFloorResponseData 
};

export type GallopFloorResponseData = {
  total_items: number,
  total_pages: number,
  page: number,
  collections: Array<GallopFloorCollections>
};

export type GallopFloorCollections = {
  collection_address: string,
  marketplaces: Array<GallopFloorCollections__MarketPlaceSlug>
}

export type GallopFloorCollections__MarketPlaceSlug = {
  updated_at: string,
  floor_price: number,
  marketplace: string,
  collection_id: string,
  sub_collection_tag: string
};

export enum GallopRankingPeriod {
  oneDay = "one_day",
  sevenDays = "seven_days",
  thirtyDays = "thirty_days",
  ninetyDays = "ninety_days",
  allTime = "all_time"
}

export enum GallopRankMetric {
  volume = "eth_volume",
  salesCount = "sales_count"
}

export type GallopRankResponse = {
  status: number,
  response: GallopRankResponseData
};

export type GallopRankResponseData = {
  total_items: number,
  total_pages: number,
  page: number,
  interval: string,
  ranking_metric: string,
  leaderboard: Array<GallopRankBoardEntry>
};

export type GallopRankBoardEntry = {
  rank: number,
  collection_address: string,
  collection_name: string,
  value: number,
  type: string,
  symbol: string
};