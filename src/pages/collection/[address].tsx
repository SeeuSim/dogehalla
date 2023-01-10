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

//For getServerSideProps
import type { Collection } from "@prisma/client";
import { prisma } from "server/db/client";
import { Decimal } from "@prisma/client/runtime";

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

  const dataPts = collection.data.map(FNS[selector]);

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
    }),
    datasets: [
      {
        data: dataPts,
        label: `${selector}`
      }
    ]
  }
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          font: {
            family: "sans-serif",
            size: 14
          }
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
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: "index" as const
    },
  };

  /**
   * PANES
   */
  const pane: JSX.Element = 
    <div 
      className={`
      bg-white border border-gray-200 rounded-lg shadow-md 
      dark:bg-gray-800 dark:border-gray-700 max-w-full max-h-full
      `}>
      <a href="#">
          <Image className="rounded-t-lg max-h-96" 
                src={collection.image} 
                alt=""
                height={300}
                width={300} />
      </a>
      <div className="p-5">
          <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{`Collection ${collection.name}`}</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {collection.description}
          </p>
          <a href={collection.extURL??"#"} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Read more
              <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </a>
      </div>
    </div>;

  const graphPane: JSX.Element = 
    <div className={`
    bg-white border border-gray-200 rounded-lg shadow-md 
    dark:bg-gray-800 dark:border-gray-700 max-w-full max-h-full
    `}>
      <select value={selector} onChange={patchedHandleSelect}>
        {dataOptions.map((o) => {
          return <option key={o} value={o}>{o}</option>
        })}
      </select>
      <Line options={options} data={data} width={400} height={300}/>
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

  //Set ISR
  const ONE_HOUR_IN_SECONDS = 60 * 60;
  const REVALIDATE_TIME = 15;
  // context.res.setHeader(
  //   'Cache-Control',
  //   `public, s-maxage=${ONE_HOUR_IN_SECONDS}, stale-while-revalidate=${REVALIDATE_TIME}`
  // );

  if (!address) return {
    redirect: { destination: "/", permanent: true }
  };

  const current = new Date(Date.now());
  current.setDate(current.getDate() - 7);

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
    )
  }

  return {
    props: {
      collection: out
    }
  }
}