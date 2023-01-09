import Link from "next/link";
import React, { useState } from "react";

import { CollectionsRank, RankPeriod } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";

import { trpc } from "utils/trpc";
import Image from "next/image";

export default function CollectionsDash() {

  const rankOptions = [CollectionsRank.avgPrice, CollectionsRank.maxPrice, CollectionsRank.salesCount, CollectionsRank.salesVolume];
  const timeOptions = [RankPeriod.oneDay, RankPeriod.sevenDays, RankPeriod.thirtyDays, RankPeriod.oneYear];

  const [refetch, triggerRefetch] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [ranking, setRanking] = useState<CollectionsRank>(CollectionsRank.avgPrice);
  const [timePeriod, setTimePeriod] = useState<RankPeriod>(RankPeriod.oneDay);

  const { data: collectionsData, isFetching, isInitialLoading } = trpc.model.nft.getTopCollections.useQuery({
    rank: ranking,
    time: timePeriod,
    cursor: pageIndex
  }, {
    onSuccess(data) {
      triggerRefetch(false);
    },
    enabled: refetch
  });
  

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const viewLength = collectionsData?.collections.length?? 10;
  const dataSize = collectionsData?.max?? collectionsData?.collections.length?? 1;
  const pages = Math.round(dataSize/viewLength) + (dataSize % viewLength > 0? 1: 0);

  const displayRank = {
    "avgPrice": "Average Price",
    "maxPrice": "Maximum Price",
    "salesCount": "Sales Count",
    "salesVolume": "Sales Volume"
  };

  function renderCollection(index: number): JSX.Element {
    return (<tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800"><td>
      <Link href={`/collection/${index}`} className="block hover:bg-gray-200 dark:hover:bg-gray-600">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="truncate text-sm font-medium text-indigo-600 dark:text-indigo-300">Collection{" "}{index}</div>
            <div className="ml-2 flex flex-shrink-0">
              <span className="inline-flex rounded-full bg-green-100 dark:bg-green-800 px-2 text-xs font-semibold leading-5 text-green-800 dark:text-green-100">
                Ethereum
              </span>
            </div>
          </div>
          <div className="mt-2 flex justify-between">
            <div className="sm:flex">
              <div className="mr-6 flex items-center text-sm text-gray-500">
                <UsersIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"/>
                Studio{" "}{index}
              </div>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"/>
              For Bid
            </div>
          </div>
        </div>
      </Link>
    </td></tr>);
  }

  const Footer: React.FC = () => {
    const PageIndex: React.FC<{ct: number}> = ({ct}) => { 
      return (
        <span className="font-medium">{`${ct}`}</span>
      );
    }
  
    const PageSelector: React.FC = () => {
      const buttonCallback = (fn: () => void) => {
        return () => {
          fn();
          triggerRefetch(true);
        }
      };

      const EdgeButton: React.FC<{left: boolean}> = ({left}) => {
        return (
          <button 
            key={left? "left": "right"}
            disabled={(left && pageIndex === 0) || (!left && pageIndex === pages - 1)}
            className={`
              relative items-center px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20 inline-flex bg-inherit
              ${left? "rounded-l-md": "rounded-r-md"}
            `}
            onClick={buttonCallback(() => setPageIndex(pageIndex + (left? -1 : 1)))}
            >
            <span className="sr-only">{left? "Previous": "Next"}</span>
            { left
              ? <ChevronLeftIcon className="h-4 w-4"/>
              : <ChevronRightIcon className="h-4 w-4"/>
            }
          </button>
        );
      }
  
      const PageButton: React.FC<{value: number, edge: boolean, selected: boolean}> = ({value, edge, selected}) => {
        return (
          <button
            key={value.toPrecision(10).toString()}
            className={`relative hidden items-center px-4 py-2 text-sm font-medium focus:z-20 ${
              selected
              ? "z-10 sm:inline-flex border border-indigo-500 bg-indigo-100  text-indigo-600"
              : edge
              ? "bg-inherit text-gray-500 hover:bg-gray-50 md:inline-flex"
              : "bg-inherit text-gray-500 hover:bg-gray-50 sm:inline-flex"
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
          <EdgeButton left={true}/>
          {/* LeftBox */}
          {leftBox.map((v, idx) => <PageButton value={v} edge={idx === 2} selected={pageIndex === v}/>)}
          
          {/* Ellipsis */}
          <span className="relative inline-flex items-center bg-inherit px-4 py-2 text-sm font-medium text-gray-700">...</span>
  
          {/* RightBox */}
          {rightBox.map((v, idx) => <PageButton value={v} edge={idx === 0} selected={pageIndex === v}/>)}
          
          <EdgeButton left={false}/>
        </>
      );
    }

    return (
      <>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between px-5 py-3">
          {/* Left */}
          <div>
            {/* Indexing Numbers - "x + 1 to x + 10 of max" */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing&nbsp;
              <PageIndex ct={pageIndex * 10 + 1}/>&nbsp;to&nbsp;
              <PageIndex ct={pageIndex * 10 + viewLength}/>&nbsp;of&nbsp;
              <PageIndex ct={dataSize}/>&nbsp;collections
            </p>
          </div>

          {/* Right */}
          <div>
            <PageSelector/>
          </div> 
        </div>
        </>
    );
  }

  const Table: React.FC<{children?: React.ReactNode}> = ({children}) => {
    const handleRankChange = (e: any) => {
      setRanking(e.target.value);
      triggerRefetch(true);
    }
    const handleTimeChange = (e: any) => {
      setTimePeriod(e.target.value);
      triggerRefetch(true);
    }

    return (
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 bg-inherit">
        <div className="inline-flex">
          <select value={ranking} onChange={handleRankChange}>
            {rankOptions.map(v => <option value={v}>{v}</option>)}
          </select>
          <select value={timePeriod} onChange={handleTimeChange}>
            {timeOptions.map(v => <option value={v}>{v}</option>)}
          </select>
        </div>
        <div className="mx-auto max-w-none"> 
          <div className="overflow-hidden bg-white dark:bg-slate-700 shadow rounded-md sm:rounded-lg">
            <table className="table-fixed w-full text-sm text-gray-600 dark:text-gray-300">
              <thead className="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"><tr><th>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between font-semibold uppercase text-sm">
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
                <tr className={(collectionsData?.collections.length?? 10) % 2 === 0 
                                ? `table-row bg-white dark:bg-gray-900`
                                : `table-row bg-gray-50 dark:bg-gray-800`}>
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
    return (
      <tr
        className="bg-gray-50 dark:bg-gray-700"
        key={index}>
        <Link href={`/collection/${address}`}>
          <div className="inline-flex  justify-between space-x-2">
            <div>{index + 1}</div>
            <Image
              src={image}
              alt={""}
              height={56}
              width={56}
              >
            </Image>
            <div className="font-bold mx-2">{name}</div>
            <div>{new Number(floor).toFixed(3)}</div>
            <div className="ml-4">
            {
              ranking != CollectionsRank.salesCount
              ? `${new Number(value).toFixed(3)} ETH`
              : value
            }
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
            index={idx + pageIndex * viewLength} 
            name={clc.collection.name??""} 
            address={clc.collection.address} 
            image={clc.collection.image}
            value={clc.value}
            floor={clc.collection.floor}
          />
        );
      })}
    </Table>
    {/* <div className="bg-gray-100 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mx-auto max-w-none">
          <p>Test</p>
          <div className="overflow-hidden bg-white dark:bg-black shadow rounded-md sm:rounded-lg">
            <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="table-header-group text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="table-row-group">
                  <th className="table-cell px-6 py-4 ">Top Collections</th>
                </tr>
              </thead>
              <tbody>
                {data.map(idx => renderCollection(idx))}
              </tbody>
              <tfoot className="table-footer-group">
                <tr className={(collectionsData?.collections.length?? 10) % 2 === 0 
                               ? `table-row bg-white dark:bg-gray-900`
                               : `table-row bg-gray-50 dark:bg-gray-800`}>
                  <td className="table-cell">
                    <Footer/>  
                  </td>
                </tr>
              </tfoot>
            </table>            
          </div>
        </div>
      </div>
    </div> */}
    </>
  );
}