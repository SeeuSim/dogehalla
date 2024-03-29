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
import { useState } from 'react';

import Head from "next/head";

import { ArrowRightIcon } from '@heroicons/react/24/outline';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

//For data fetching and processing
import type { DataPoint } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { trpc } from "utils/trpc";

import { formatFloor, formatVal } from 'utils/ethereum/price';
import LineGraph from 'components/graphs/lineGraph';
import ImageWithFallback from "components/images/imageWithFallback";
import LoadingUI from "./(components)/loading";

const numberFmt = (param: Decimal | bigint | null) => {
  return new Number(param??0).valueOf();
}

const CollectionPage: NextPage<{
  address: string
}> = ( { address } ) => {
  // Graph Filter Options
  const dataOptions = [
    "Average Price",
    "Maximum Price",
    "Minimum Price",
    "Sales Count",
    "Sales Volume",
    "Tokens Minted",
    "Tokens Burned",
    "Total Tokens Minted",
    "Total Tokens Burned",
    "Owners"
  ] as const;
  
  const FNS = {
    "Average Price": (i: DataPoint) => numberFmt(i.avgPrice),
    "Maximum Price": (i: DataPoint) => numberFmt(i.maxPrice),
    "Minimum Price":(i: DataPoint) => numberFmt(i.minPrice),
    "Sales Count": (i: DataPoint) => numberFmt(i.salesCount),
    "Sales Volume": (i: DataPoint) => numberFmt(i.salesVolume),
    "Tokens Minted": (i: DataPoint) => numberFmt(i.tokensMinted),
    "Tokens Burned": (i: DataPoint) => numberFmt(i.tokensBurned),
    "Total Tokens Minted": (i: DataPoint) => numberFmt(i.totalMinted),
    "Total Tokens Burned": (i: DataPoint) => numberFmt(i.totalBurned),
    "Owners": (i: DataPoint) => numberFmt(i.ownersCount)
  } as const;

  const {data: collection } = trpc.model.nft.collectionsPage.useQuery({address: address});
  
  const [selector, setSelector] = useState<keyof typeof FNS>(dataOptions[0]);
  const [records, setRecords] = useState(7);

  const patchedHandleSelect = (e: any & {target: { value: keyof typeof FNS}}) => {
    setSelector(e.target.value);
  }

  if (!collection || !address) { //Loading UI
    return (<LoadingUI/>);
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
    return selector === "Average Price" || selector === "Maximum Price" || selector ==="Minimum Price" || selector ==="Sales Volume"
    ? `${value} ETH`
    : value
  }
  
  /**
   * PANES
  */
  const MainPane: React.FC = () => {
    return (
      <div 
        className={`
        bg-white border border-gray-200 rounded-lg shadow-md 
        dark:bg-gray-800 dark:border-gray-700 max-w-full
        `}>
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

        <div className="p-4 sm:p-5 mt-14">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{collection.name}</h5>
            
            <article className="prose xl:prose-lg prose-p:dark:text-gray-300 prose-p:text-gray-800 prose-a:text-blue-700 prose-a:dark:text-blue-500">
              <ReactMarkdown remarkPlugins={[gfm]} className="mb-3">
                {collection.description??""}
              </ReactMarkdown>
            </article>
            <a href={collection.extURL??"#"} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Find out more
              <ArrowRightIcon className="w-4 h-4 ml-2 -mr-1"/>
            </a>
        </div>
      </div>
    );
  };

  const GraphPane: React.FC = () => {
    return (
      <div className={`
      bg-white border border-gray-200 rounded-lg shadow-md 
      dark:bg-gray-800 dark:border-gray-700 max-w-full max-h-full
      `}>

        <div className="float-right p-2 space-x-2 mb-10">
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
        
        
        <div className="px-2 mb-2">
          <LineGraph width={800} height={400} yCallback={yAxisCallback} graphLabel={selector} labels={graphLabels} dataPts={dataPts}/> 
        </div>
      </div>
    );
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4 grid-rows-2 lg:grid-rows-1">
      <Head>
        <title>{`Collection ${collection.name || address} | NFinsighT`}</title>
      </Head>
      <MainPane/>
      <GraphPane/>
    </div>
  );
}

export default CollectionPage;

export async function getServerSideProps(context: GetServerSidePropsContext & {params: {address?: string}}) {
  const { address } = context.params;

  
  if (!address) return {
    redirect: { destination: "/", permanent: true }
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
      address
    }
  }
}