"use client"

import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useState, Fragment } from "react";

export default function Searchbar() {

  const searchFilters = ["All", "Collections", "Tokens"];

  const [searchFilterState, setSearchFilterState] = useState(searchFilters[0]);

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
    <form>
      <div className="flex">
        {searchFilterComponent}
        <div className="relative w-full">
            <input type="search" 
                    id="search-dropdown" 
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
    </form>
  );
}