"use client"
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
import type { Collection, DataPoint } from "@prisma/client";
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

const CollectionPage: NextPage<{
  collection: (Collection & { data: DataPoint[]}) | null
}> = ( { collection } ) => {
  const router = useRouter();

  if (!collection) {
    router.push("/");
    return <div></div>
  }

  const address = collection.address;

  /**
   * TODO: Add fetched data from prisma/postgres 
   */

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August"],
    datasets: [
      {
        data: [0.1, 0.4, 0.2, 0.3, 0.7, 0.4, 0.6, 0.3]
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
        display: false,
      },
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
        hitRadius: 0,
      },
    },
    scales: {
      xAxis: {
        display: false,
      },
      yAxis: {
        display: false,
      },
    },
  };

  /**
   * PANES
   */
  const pane: JSX.Element = 
    <div className={`
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
      <Line data={data} width={400} height={300} options={options}/>
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

  if (!address) return { props: {}}

  const current = new Date(Date.now());
  current.setDate(current.getDate() - 7 * 24 * 60 * 60);

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
        }
      }
    }
  });

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