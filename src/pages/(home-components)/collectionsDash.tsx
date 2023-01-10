import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { CollectionsRank, RankPeriod } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { trpc } from "utils/trpc";
import { blurImageURL } from "components/images/imageProps";

export default function CollectionsDash() {
  const RECORDS_PER_PAGE = 10;

  const rankOptions = [...Object.values(CollectionsRank)];
  const timeOptions = [...Object.values(RankPeriod)];

  const [refetch, triggerRefetch] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [ranking, setRanking] = useState<CollectionsRank>(CollectionsRank.avgPrice);
  const [timePeriod, setTimePeriod] = useState<RankPeriod>(RankPeriod.oneDay);

  const { data: collectionsData, isFetching, isInitialLoading } = trpc.model.nft.getTopCollections.useQuery({
    rank: ranking,
    time: timePeriod,
    cursor: pageIndex,
    limit: RECORDS_PER_PAGE
  }, {
    onSuccess(data) {
      triggerRefetch(false);
    },
    enabled: refetch
  });

  const viewLength = collectionsData?.collections.length?? RECORDS_PER_PAGE;
  const dataSize = collectionsData?.max?? collectionsData?.collections.length?? 1;
  const pages = Math.ceil(dataSize/(viewLength < RECORDS_PER_PAGE? RECORDS_PER_PAGE: viewLength));

  const displayRank = {
    "avgPrice": "Average Price",
    "maxPrice": "Maximum Price",
    "salesCount": "Sales Count",
    "salesVolume": "Sales Volume"
  };

  const displayTime = {
    "oneDay": "24h",
    "sevenDays": "7d",
    "thirtyDays": "30d",
    "oneYear": "1y"
  };

  const PageSelector: React.FC = () => {
    const buttonCallback = (fn: () => void) => {
      return () => {
        fn();
        triggerRefetch(true);
      }
    };

    const EdgeButton: React.FC<{left: boolean, skipfinal?: boolean}> = ({left, skipfinal=false}) => {
      const pageToSkip = skipfinal && left
        ? 0
        : skipfinal
        ? pages - 1
        : left
        ? pageIndex - 1
        : pageIndex + 1;
      return (
        <button 
          key={left? "left": "right"}
          disabled={(left && pageIndex === 0) || (!left && pageIndex === pages - 1)}
          className={`
            relative items-center px-2 py-[10px] text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-600 focus:z-20 bg-inherit
            ${skipfinal? left? "rounded-l-md": "rounded-r-md": ""} ${skipfinal? "hidden lg:inline-flex" : "inline-flex"}
          `}
          onClick={buttonCallback(() => setPageIndex(pageToSkip))}
          >
          <span className="sr-only">{skipfinal? left? "First Page": "Last Page": left? "Previous Page" : "Next Page"}</span>
          { skipfinal
            ? left ? <ChevronDoubleLeftIcon className="h-4 w-4"/> : <ChevronDoubleRightIcon className="h-4 w-4"/>
            : left ? <ChevronLeftIcon className="h-4 w-4"/> : <ChevronRightIcon className="h-4 w-4"/>
          }
        </button>
      );
    }

    const PageButton: React.FC<{value: number, edge: boolean, selected: boolean}> = ({value, edge, selected}) => {
      return (
        <button
          className={`relative hidden items-center px-4 py-2 text-sm font-medium focus:z-20 ${
            selected
            ? "z-10 sm:inline-flex border border-indigo-500 bg-indigo-100 dark:bg-slate-800  text-indigo-600 dark:text-slate-200 dark:border-slate-800"
            : edge
            ? "bg-inherit text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 md:inline-flex"
            : "bg-inherit text-gray-500 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 sm:inline-flex"
          }`} 
          onClick={buttonCallback(() => setPageIndex(value))}>
          {value + 1}
        </button>
      );
    }

    const viewBox = pageIndex <= 0
      ? [pageIndex, pageIndex + 1, pageIndex + 2]
      : pageIndex >= pages - 1
      ? [pageIndex - 2, pageIndex - 1, pageIndex]
      : [pageIndex - 1, pageIndex, pageIndex + 1];

    const leftBox = pageIndex < pages / 2
      ? viewBox
      : [0, 1, 2];

    const rightBox = pageIndex >= pages / 2
      ? viewBox
      : [pages - 3, pages - 2, pages - 1];

    return (
      <>
        <EdgeButton left={true} skipfinal={true}/>
        <EdgeButton left={true}/>
        {/* LeftBox */}
        {leftBox.map((v, idx) => <PageButton key={v.toLocaleString()} value={v} edge={idx === 2} selected={pageIndex === v}/>)}
        
        {/* Ellipsis */}
        <div className="relative inline-flex items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <span className="-translate-y-[3.5px]">...</span>
        </div>

        {/* RightBox */}
        {rightBox.map((v, idx) => <PageButton key={v.toLocaleString()} value={v} edge={idx === 0} selected={pageIndex === v}/>)}
        
        <EdgeButton left={false}/>
        <EdgeButton left={false} skipfinal={true}/>
      </>
    );
  }

  const Footer: React.FC = () => {
    const PageIndex: React.FC<{ct: number}> = ({ct}) => { 
      return (
        <span className="font-medium">{`${ct}`}</span>
      );
    }

    return (
      <>
        <div className="flex flex-1 items-center justify-between px-5 py-3">
          {/* Left */}
          <div>
            {/* Indexing Numbers - "x + 1 to x + RECORDS_PER_PAGE of max" */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing&nbsp;
              <PageIndex ct={pageIndex * RECORDS_PER_PAGE + 1}/>&nbsp;to&nbsp;
              <PageIndex ct={pageIndex * RECORDS_PER_PAGE + viewLength}/>&nbsp;of&nbsp;
              <PageIndex ct={dataSize}/>&nbsp;collections
            </p>
          </div>

          {/* Right */}
          <div className="bg-white dark:bg-slate-700 flex items-center rounded-md py-0.5 px-1">
            <PageSelector/>
          </div> 
        </div>
      </>
    );
  }

  const Table: React.FC<{children?: React.ReactNode}> = ({children}) => {
    const handleRankChange = (e: any) => {
      setPageIndex(0);
      setRanking(e.target.value);
      triggerRefetch(true);
    }
    const handleTimeChange = (e: any) => {
      setPageIndex(0);
      setTimePeriod(e.target.value);
      triggerRefetch(true);
    }

    return (
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 bg-inherit">
        <h1 className="mb-4 mx-4 text-2xl font-bold dark:text-slate-200">Top Collections</h1>
        <div className="flex justify-between">
          <div className="inline-flex space-x-4 items-center self-center -translate-y-2">
            <select 
              className="flex w-auto p-2 bg-white dark:bg-slate-600 dark:text-slate-200 text-medium text-center shadow-sm rounded-md mr-2"
              value={ranking} 
              onChange={handleRankChange}
              >
              {rankOptions.map(v => 
                <option 
                  className="p-1 bg-white"
                  key={v} 
                  value={v}>{displayRank[v]}</option>)}
            </select>
            <select 
              className="flex w-auto p-2 bg-white dark:bg-slate-600 dark:text-slate-200 text-medium text-center shadow-sm rounded-md"
              value={timePeriod} 
              onChange={handleTimeChange}
              >
              {timeOptions.map(v => 
                <option 
                  className="p-1 bg-white"
                  key={v} 
                  value={v}>{displayTime[v]}</option>)}
            </select>
          </div>
          <div className="flex justify-end pb-4">
            <div className="bg-white dark:bg-slate-700 flex items-center rounded-md py-0.5 px-1">
            <PageSelector/>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-none"> 
          <div className="overflow-hidden bg-white dark:bg-slate-700 shadow rounded-md sm:rounded-lg">
            <table className="table-fixed w-full text-sm text-gray-600 dark:text-gray-300">
              <thead className="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th>
                <div className="px-4 pt-4 sm:px-6">
                  <div className="flex items-center pb-4 justify-between font-semibold uppercase text-sm border-b-[0.5px] border-slate-500">
                    <div className="uppercase truncate">Collection</div>
                    <div className="inline-flex items-center">
                      <div className="hidden md:block mr-4">
                        Floor Price
                      </div>
                      <div className="ml-2 flex flex-shrink-0 px-2">
                        <p className="">{displayRank[ranking]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </th></tr></thead>
              <tbody>
                {children}
              </tbody>
              <tfoot className="table-footer-group">
                <tr className="table-row dark:bg-slate-800">
                  <td className="table-cell">
                    <Footer/>  
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const CollectionRow: React.FC<{
    index: number,
    name: string,
    image: string,
    address: string,
    floor: Decimal | null,
    value?: string
  }> = ({index, name, image, address, floor, value}) => {
    const [imageErr, setImageErr] = useState(false);

    const formatVal = (v?: string) => {
      if (!v) return "0"
      const actual = new Number(v);
      return actual > 1e9
        ? `${actual.toExponential(3).toLocaleUpperCase("en-US")}`
        : actual > 1e6
        ? `${new Number(actual.valueOf()/1e6).toLocaleString("en-US", {maximumSignificantDigits: 4})} M`
        : actual > 1e3
        ? `${actual.toLocaleString("en-US", {maximumSignificantDigits: 5})}`
        : actual.toLocaleString("en-US", {maximumFractionDigits: 3})
    }
    
    const formatFloor = () => {
      if (floor === null) return "0"
      const flr = new Number(floor);
      return flr < 1e-6
        ? flr.toExponential(2)
        : flr.toLocaleString("en-US", {maximumFractionDigits: 3})
    }

    return (
      <tr
        className="bg-gray-50 dark:bg-gray-700"
        key={index}>
        <Link href={`/collection/${address}`}>
          <div className="px-4 py-2 sm:px-6 w-full inline-flex items-center justify-between space-x-2 hover:bg-slate-100 dark:hover:bg-slate-600">
            <div className="inline-flex items-center">
              <div className="inline-flex items-center">
                <div className="text-start font-medium w-8">{index + 1}</div>
                <div className="relative h-16 w-16 rounded-md overflow-hidden shadow-sm border-[0.5px] dark:border-slate-800">
                  <Image
                    src={imageErr? "/collection_fallback.webp": image} 
                    alt={""} 
                    fill={true} 
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL={blurImageURL("64", "64")}
                    onError={() => setImageErr(true)}/>
                </div>
              </div>
              <div className="block">
                <div className="font-bold mx-2 truncate max-w-[27vw] sm:max-w-none sm:text-clip">
                  {
                    name.length > 0 
                    ? name 
                    : <code className="font-light">collection_name</code>
                  }
                </div>
                <div className="md:hidden mx-2 text-xs truncate max-w-[27vw] sm:max-w-none sm:text-clip">Floor:&nbsp;{formatFloor()}&nbsp;ETH</div>
              </div>
            </div>
            <div className="inline-flex sm:px-4">
              <div className="hidden md:block w-24 px-2 text-center mr-6 font-medium">{formatFloor()}&nbsp;ETH</div>
              <div className="w-28 text-center pr-2 font-medium">
                {
                  ranking != CollectionsRank.salesCount
                  ? `${formatVal(value)} ETH`
                  : formatVal(value)
                }
              </div>
            </div>
          </div>
        </Link>
      </tr>
    )
  }

  return (
    <>
      <Table>
        {collectionsData?.collections.map((clc, idx) => {
          const k = clc.collection.floor;
          return (
            <CollectionRow
              key={clc.id}
              index={idx + pageIndex * (viewLength < RECORDS_PER_PAGE? RECORDS_PER_PAGE: viewLength)} 
              name={clc.collection.name??""} 
              address={clc.collection.address} 
              image={clc.collection.image}
              value={clc.value}
              floor={clc.collection.floor}
            />
          );
        })}
      </Table>
    </>
  );
}