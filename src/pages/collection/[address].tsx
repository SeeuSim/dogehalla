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
import { useState } from 'react';
import { GetServerSidePropsContext, NextPage } from "next";

import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ArrowRightIcon } from '@heroicons/react/24/outline';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

//For getServerSideProps
import type { Collection } from "@prisma/client";
import { prisma } from "server/db/client";
import { Decimal } from "@prisma/client/runtime";
import { blurImageURL } from 'components/images/imageProps';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type DataType = {
  timestamp: string,
  avgPrice: number,
  maxPrice: number,
  minPrice: number,
  salesCount: number,
  salesVolume: number,
  tokensMinted: number,
  tokensBurned: number,
  totalMinted: number,
  totalBurned: number,
  ownersCount: number
}

const CollectionPage: NextPage<{
  collection: (Collection & { data: DataType[]}) | null
}> = ( { collection } ) => {
  const router = useRouter();

  if (!collection) { //Redirect for invalid queries
    router.push("/")
    return <div></div>
  }

  const address = collection.address;

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
    "Average Price": (i: DataType) => i.avgPrice,
    "Maximum Price": (i: DataType) => i.maxPrice,
    "Minimum Price":(i: DataType) => i.minPrice,
    "Sales Count": (i: DataType) => i.salesCount,
    "Sales Volume": (i: DataType) => i.salesVolume,
    "Tokens Minted": (i: DataType) => i.tokensMinted,
    "Tokens Burned": (i: DataType) => i.tokensBurned,
    "Total Tokens Minted": (i: DataType) => i.totalMinted,
    "Total Tokens Burned": (i: DataType) => i.totalBurned,
    "Owners": (i: DataType) => i.ownersCount
   } as const;

  const [selector, setSelector] = useState<keyof typeof FNS>(dataOptions[0]);
  const [records, setRecords] = useState(7);
  const [imageErr, setImageErr] = useState(false);
  const [bgImgErr, setBgImgErr] = useState(false);

  const startIDX = collection.data.length - records < 0? 0 : collection.data.length - records

  const dataPts = collection.data.map(FNS[selector]).slice(startIDX);

  const patchedHandleSelect = (e: any & {target: { value: keyof typeof FNS}}) => {
    setSelector(e.target.value);
  }

  const data = {
    labels: collection.data.map(i => {
      const d = new Date(i.timestamp);
      return `${d.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short"
      })}`
    }).slice(startIDX),
    datasets: [
      {
        data: dataPts,
        label: `${selector}`
      }
    ]
  }
  

  /**
   * PANES
   */
  const pane: JSX.Element = 
    <div 
      className={`
      bg-white border border-gray-200 rounded-lg shadow-md 
      dark:bg-gray-800 dark:border-gray-700 max-w-full max-h-full
      `}>
      <div className="">
      <div className="relative w-full h-36 overflow-hidden rounded-t-lg shadow-md">
        <Image 
          className="object-cover"
          src={bgImgErr? "/collection_fallback.webp": collection.bannerImg}
          alt={""}
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw" 
          fill={true}
          placeholder="blur"
          blurDataURL={blurImageURL("64", "64")}
          onError={() => setBgImgErr(true)}/>
      </div>
      </div>
      
      <div className="px-4 pt-4 flex absolute -translate-y-20">
        <div className="h-32 w-32 rounded-lg relative overflow-hidden shadow-sm flex border-[1px] dark:border-slate-700">
          <Image 
            className="object-cover bg-slate-50 dark:bg-slate-600" 
            src={imageErr? "/collection_fallback.webp": collection.image} 
            alt={""}
            sizes="128" 
            fill={true}
            placeholder="blur"
            blurDataURL={blurImageURL("64", "64")}
            onError={() => setImageErr(true)}
          />
        </div>
      </div>

      <div className="m-2 rounded-md p-2 bg-slate-700 float-right shadow-md text-slate-300">
        <div className="">{`Floor Price: ${collection.floor} ETH`}</div>
        <div>{`Market Cap: ${new Number(collection.salesVolume).toLocaleString("en-US")} ETH`}</div>
        <div>{`Owners: ${collection.owners}`}</div>
      </div>

      <div className="p-5 mt-14">
          <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{collection.name}</h5>
          </a>
          <ReactMarkdown remarkPlugins={[gfm]} className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {collection.description??""}
          </ReactMarkdown>
          <a href={collection.extURL??"#"} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Read more
            <ArrowRightIcon className="w-4 h-4 ml-2 -mr-1"/>
          </a>
      </div>
    </div>;

  const Graph = () => {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
              family: "system-ui"
            },
            color: "#64748b"
          },
          display: true
        }
      },
      elements: {
        line: {
          tension: 0,
          borderWidth: 2,
          borderColor: "rgba(47, 97, 68, 1)",
          fill: "start",
          backgroundColor: "rgba(47, 97, 68, 0.3)",
        },
        point: {
          radius: 0,
          hitRadius: 0
        },
      },
      scales: {
        y: {
          type: 'linear' as const,
          display: true,
          position: 'left' as const,
          min: 0,
          ticks: {
            callback: function(value: any, index: any, ticks: any) {
              return selector === "Average Price" || selector === "Maximum Price" || selector ==="Minimum Price" || selector ==="Sales Volume"
                ? `${value} ETH`
                : value
            },
            color: "#64748b" 
          },
          labels: {
            font: {
              family: "system-ui"
            }
          }
        },
        x: {
          ticks: {
            color: "#64748b" 
          },
          label: {
            font: {
              family: "system-ui"
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: "index" as const
      },
    };
    return (
      <Line options={options} data={data} width={400} height={300}/>
    );
  }

  const graphPane: JSX.Element = 
    <div className={`
    bg-white border border-gray-200 rounded-lg shadow-md 
    dark:bg-gray-800 dark:border-gray-700 max-w-full max-h-full
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
        </select>
      </div>

      <div className="px-4">
        <Graph/>
      </div>
    </div>


  return (
    <div className="py-4 grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-4 grid-rows-2 lg:grid-rows-1 h-full">
      <Head>
        <title>{`Collection ${address} | DogeTTM`}</title>
      </Head>
      {pane}
      {graphPane}
    </div>
  );
}

export default CollectionPage;

export async function getServerSideProps(context: GetServerSidePropsContext & {params: {address?: string}}) {
  const { address } = context.params;

  
  if (!address) return {
    redirect: { destination: "/", permanent: true }
  };
  
  const current = new Date(Date.now());
  current.setDate(current.getDate() - 30);
  
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