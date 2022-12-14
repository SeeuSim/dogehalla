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

export default function Collection() {
  const router = useRouter();
  const { address } = router.query;

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
                src="https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&w=384" 
                alt=""
                height={300}
                width={300} />
      </a>
      <div className="p-5">
          <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{`Collection ${address}`}</h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
            enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
            in reprehenderit in voluptate velit esse cillum dolore eu fugiat 
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
            sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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