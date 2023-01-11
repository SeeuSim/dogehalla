import { useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";

import { blurImageURL } from "utils/images/imageProps";
import { trpc } from "utils/trpc";
import { formatFloor } from "utils/ethereum/price";

//Pass in the refocus function from Popover to close the searchbar
export default function Searchbar({ fn } : { fn: (ref?: HTMLElement) => void }) {

  const router = useRouter();

  const searchFilters = ["All", "Name", "Address"] as const;

  const [searchFilterState, setSearchFilterState] = useState(searchFilters[0]);
  const [searchField, setSearchField] = useState("");
  const [refetch, triggerRefetch] = useState(false);

  const {data: collections} = trpc.model.nft.getCollection.useQuery({
    field: searchField,
    filter: searchFilterState
  }, {
    onSuccess: (data) => {
      triggerRefetch(false);
    },
    enabled: refetch && searchField.length > 0
  })

  const searchFilterComponent = 
    <Listbox value={searchFilterState} onChange={setSearchFilterState}>
      <Listbox.Button className={`
        px-2.5 rounded-none rounded-l-lg
        w-44 inline-flex justify-between items-center
        bg-gray-50 border border-gray-300 
        hover:bg-gray-200
        focus:ring-blue-500 focus:border-blue-500 
        text-gray-600
        dark:hover:bg-gray-600
        dark:bg-gray-700 dark:border-gray-600 
        dark:placeholder-gray-400 dark:text-white 
        dark:focus:ring-blue-500 dark:focus:border-blue-500
        `}>
        <span className="block">{searchFilterState}</span>
        <ChevronDownIcon className="block h-5 w-5"></ChevronDownIcon>
      </Listbox.Button>
      <Transition as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
        <Listbox.Options className={`
            absolute w-32 max-h-60 overflow-auto rounded-md 
            bg-white py-1 text-base shadow-lg dark:bg-gray-700 
            ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm
            `}>
          {searchFilters.map((filterOption) => (
            <Listbox.Option
              key={filterOption}
              className={({ active }) =>
                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                  active ? ' bg-slate-300 text-slate-900' : 'text-gray-900 dark:text-white'
                }`
              }
              value={filterOption}
            >
              {({ selected }) => (
                <>
                  <span
                    className={`block truncate ${
                      selected ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    {filterOption}
                  </span>
                  {selected ? (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-500">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  ) : null}
                </>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Transition>
    </Listbox>;

  return (
    <form onSubmit={(e) => {
      if (collections != undefined && collections.length > 0) {
        //Should push a search page - WIP
        router.push(`/collection/${collections[0]?.address}`)
      }
      //Replace with toast
      console.log("Please search for a collection first");
    }}>
      <div className="flex relative">
        {searchFilterComponent}
        <div className="relative w-full">
            <input type="search" 
                    id="search-dropdown"
                    onChange={(e) => {
                      setSearchField(e.target.value);
                      triggerRefetch(true);
                    }}
                    className={`
                      block p-2.5 w-full z-20 
                      text-sm text-gray-900 
                      bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 
                      focus:ring-blue-500 focus:border-blue-500 

                      dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 
                      dark:text-white dark:focus:border-blue-500
                    `}
                    placeholder="Search Your NFT" required/>
            <button type="submit" 
                    className={`
                      absolute top-0 right-0 p-2.5 
                      text-sm font-medium text-white 
                      bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 
                      dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800
                    `}>
              <svg aria-hidden="true" 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                </path>
              </svg>
              <span className="sr-only">Search</span>
            </button>
        </div>
      </div>
      <div className="absolute right-2 mt-1 w-full pl-[152px]">
        <div className="bg-slate-50 dark:bg-blue-300 rounded-md grid grid-cols-1">
        {
          collections != undefined && collections.length > 0
          ? collections.map((i, idx) => {
              
              return (
                <div key={i.address} className="py-1 px-2 hover:bg-blue-400 rounded-md">
                  <Link 
                    href={`/collection/${i.address}`} 
                    onClick={() => {
                      fn();
                      setSearchField("");
                    }}>
                    <div className="inline-flex items-center p-1">
                      { i.name 
                        ? <p className="w-40 truncate font-bold text-slate-800">{i.name}</p>
                        : <p className="w-40 truncate text-xs font-light font-mono text-slate-700">{i.address}</p>
                      }
                      <div className="w-24 text-xs ml-2 py-px px-1.5 rounded-xl justify-between bg-blue-600">
                        <span className="font-medium">Floor Price:&nbsp;</span>
                        <div>
                        <span className="w-16 truncate font-mono font-light">{formatFloor(i.floor)}</span>
                        <span className="font-medium">&nbsp;ETH</span>
                        </div>
                      </div>
                      <Image 
                        className="rounded-lg ml-2"
                        src={i.image} 
                        alt=""
                        height="44"
                        width="44"
                        sizes="44px" 
                        placeholder="blur"
                        blurDataURL={blurImageURL("40", "40")}
                        />
                    </div>
                    </Link>
                </div>
              );
            })
          : searchField.length > 0 
          ? <div className="p-2 font-medium text-blue-900">There are no collections available with that {searchFilterState === "All" ? "name/address" : searchFilterState === "Name" ? "name" : "address"}. Please try again.</div>
          : <div className="p-2 font-medium text-blue-900">Enter your query</div>
        }
        </div>
      </div>
    </form>
  );
}