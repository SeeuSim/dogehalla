/**
 * Ideal Layout:
 * 
 * Idea:
 * - Have 2 `div`s
 * - Have a parent `div`
 *   - "sm: flex"
 *   - "md: inline-flex"
 * - Analytics/Trends `div`
 *   - "sm: collapsed" or sth
 *   - "md: block" or sth
 * 
 * Desktop: 
 * _______________________________________
 * |                 |                   |
 * | Collection View | Price Trends Pane |
 * |                 |                   |
 * ---------------------------------------
 * 
 * Mobile:
 * 
 * ____________________
 * |                  |
 * | Collections View |
 * |                  |
 * --------------------
 * |                  |
 * | Trend Pane       |
 * | (Collapsible)    |
 * |                  |
 * --------------------
 */
import { GetServerSidePropsContext, NextPage } from "next";
import { Suspense, useEffect, useState } from 'react';

import Head from "next/head";
import { useRouter } from "next/router";

//For getServerSideProps
import type { Collection } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { prisma } from "server/db/client";

import { formatFloor, formatVal } from 'utils/ethereum/price';
import LineGraph from 'components/graphs/lineGraph';
import ImageWithFallback from "components/images/imageWithFallback";
import Cards from "./(analytics-components)/cards";

type DataType = {
  timestamp: string,
  avgPrice: number,
  sentiment: number,
  predPrice: number,
  percRise: number
}

const AnalyticsPage: NextPage<{
  collection: (Collection & { data: DataType[]}) | null
}> = ( { collection } ) => {
  const router = useRouter();

  const address = collection?.address;
  
  // Graph Filter Options
  const dataOptions = [
    "Average Price",
    "Sentiment",
    "Predicted Price",
    "Percent Rise"
  ] as const;
  
  const FNS = {
    "Average Price": (i: DataType) => i.avgPrice,
    "Sentiment": (i:DataType) => i.sentiment,
    "Predicted Price": (i:DataType) => i.predPrice,
    "Percent Rise": (i:DataType) => i.percRise,
  } as const;
  
  const [selector, setSelector] = useState<keyof typeof FNS>(dataOptions[0]);
  const [records, setRecords] = useState(7);

  const patchedHandleSelect = (e: any & {target: { value: keyof typeof FNS}}) => {
    setSelector(e.target.value);
  }

  if (!collection || !address) { //Redirect for invalid queries
    router.push("/")
    return <div></div>
  }

  const startIDX = collection.data.length - records < 0? 0 : collection.data.length - records
  const dataPts = collection.data.map(FNS[selector]).slice(startIDX);
  const graphLabels = collection.data.map(i => {
    const d = new Date(i.timestamp);
    return `${d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short"
    })}`
  }).slice(startIDX);
  const yAxisCallback = (value: any, index: any, ticks: any) => {
    return selector === "Average Price" || selector === "Predicted Price"
    ? `${value} ETH`
    : value
  }
  
  /**
   * PANES
  */
 const pane: JSX.Element = 
  <div 
    className={`
    bg-white border border-gray-200 rounded-lg shadow-md 
    dark:bg-gray-800 dark:border-gray-700 max-w-full
 `   }>
      <div className="">
      <div className="relative w-full h-36 overflow-hidden rounded-t-lg shadow-md">
        <ImageWithFallback 
          src={collection.bannerImg}
          style=""
          height={300} 
          width={800} 
          size={`(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw`}/>
      </div>
      </div>
      
      <div className="px-3 sm:px-4 pt-4 flex absolute -translate-y-20">
        <div className="h-32 w-32 rounded-lg relative overflow-hidden shadow-sm flex border-[1px] dark:border-slate-700">
          <ImageWithFallback style="bg-slate-50 dark:bg-slate-600" src={collection.image} height={128} width={128} size={128}/>
        </div>
      </div>

      <div className="mr-5 mt-3 rounded-md p-2 bg-slate-100 dark:bg-slate-700 float-right shadow-md text-slate-800 dark:text-slate-300 hidden sm:block">
        <div className="">{`Floor Price: ${formatFloor(collection.floor)} ETH`}</div>
        <div>{`Market Cap: ${formatVal(collection.salesVolume)} ETH`}</div>
        <div>{`Owners: ${collection.owners}`}</div>
      </div>

      <div className="m-3 p-2 text-xs space-y-1 rounded-md float-right sm:hidden bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
        <div>
          <div className="font-semibold">Floor Price:</div>
          <div>{`${collection.floor} ETH`}</div>
        </div>
        <div>
          <div className="font-semibold">Market Cap:</div>
          <div>{`${new Number(collection.salesVolume).toLocaleString("en-US")} ETH`}</div>
        </div>
      </div>
     
      <div className="m-3 p-2 text-xs space-y-1 rounded-md float-right sm:hidden bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300">
        <div>
          <div className="font-semibold">Floor Price:</div>
          <div>{`${collection.floor} ETH`}</div>
        </div>
      </div>
  </div>
  


  const graphPane: JSX.Element = 
    <>
    <div className={`
    bg-white border border-gray-700 rounded-lg shadow-md  
    align-center justify-center
    dark:bg-gray-800 dark:border-gray-700 max-w-5xl max-h-full
    `}>

    
      <div className="float-right p-2 space-x-2">
        <select 
          className="rounded-md p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 shadow-md"
          value={selector} 
          onChange={patchedHandleSelect}
          >
          {dataOptions.map((o) => {
            return <option key={o} value={o}>{o}</option>
          })}
        </select>
        <select 
          className="rounded-md p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 shadow-md"
          value={records} 
          onChange={(e: any & {target: {value: number}}) => setRecords(e.target.value)}
          >
          <option key={7} value={7}>7d</option>
          <option key={30} value={30}>30d</option>
          <option key={365} value={365}>1y</option>
        </select>
      </div>

      <div className="p-4 sm:p-5 mt-14 align-center">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{collection.name}</h5>
      </div>

      <div className="px-4 align-center justify-center">
        <LineGraph width={800} height={500} yCallback={yAxisCallback} graphLabel={selector} labels={graphLabels} dataPts={dataPts}/> 
      </div>
    </div>
    </>


  return (
    <div className="table-fixed">
      <Head>
        <title>{`Collection ${collection.name || address} | NFinsighT`}</title>
      </Head>
      <Suspense fallback={<div className="text-9xl m-10 text-white">Loading</div>}>
        {pane}
        <div className="table-auto items-center vertical-align margin-auto">
          <Cards/>
          {graphPane}
        </div>
      </Suspense>
    </div>
  );
}

export default AnalyticsPage;

export async function getServerSideProps(context: GetServerSidePropsContext & {params: {address?: string}}) {
  const { address } = context.params;

  
  if (!address) return {
    redirect: { destination: "/", permanent: true }
  };
  
  const current = new Date(Date.now());
  current.setDate(current.getDate() - 365);
  
  const numberFmt = (n: Decimal | bigint | null | undefined ) => {
    return new Number(n?? 0).valueOf()
  }
  
  const collection = await prisma.collection.findUnique({
    where: {
      address: address
    },
    include: {
      data: {
        where: {
          timestamp: {
            gte: current
          }
        },
        orderBy: {
          timestamp: "asc"
        }
      }
    }
  });
  
  if (!collection) return {
    redirect: { destination: "/", permanent: true }
  };
  
  const out = {
    address: collection?.address,
    name: collection?.name,
    image: collection?.image,
    bannerImg: collection?.bannerImg,
    description: collection?.description,
    extURL: collection?.extURL,
    
    floor: numberFmt(collection?.floor),
    salesVolume: numberFmt(collection?.salesVolume),
    owners: collection?.owners,
    
    data: collection?.data.map(
      (d) => {
        return {
          timestamp: d.timestamp.toJSON(),
          avgPrice: numberFmt(d.avgPrice),
          maxPrice: numberFmt(d.maxPrice),
          minPrice: numberFmt(d.minPrice),
          salesCount: numberFmt(d.salesCount),
          salesVolume: numberFmt(d.salesVolume),
          tokensMinted: numberFmt(d.tokensMinted),
          tokensBurned: numberFmt(d.tokensBurned),
          totalMinted: numberFmt(d.totalMinted),
          totalBurned: numberFmt(d.totalBurned),
          ownersCount: numberFmt(d.ownersCount)
        }
      }
    ),
  };

  //Set ISR
  const ONE_HOUR_IN_SECONDS = 60 * 60;
  const REVALIDATE_TIME = 15;
  context.res.setHeader(
    'Cache-Control',
    `public, s-maxage=${ONE_HOUR_IN_SECONDS}, stale-while-revalidate=${REVALIDATE_TIME}`
  );
    
  return {
    props: {
      collection: out
    }
  }
}