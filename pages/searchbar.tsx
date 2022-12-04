"use-client"

import { useState } from "react";

export default function Searchbar() {

  const selectLabels = ["All Categories", "Token", "Collection"]

  function renderLabel(label: string): JSX.Element {
    return (
      <option key={label} value={label}>{label}</option>
    );
  }

  const [clicked, toggleClick] = useState(false);

  return (
    <form>
      <div className="flex">
        <select id="countries" 
                className={`
                  bg-gray-50 max-w-min 
                  border border-gray-300 
                  text-gray-900 text-sm 
                  rounded-l-lg 
                  focus:ring-blue-500 focus:border-blue-500 
                  block w-full p-2.5 
                  
                  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                  dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                defaultValue={"All Categories"}>
          {selectLabels.map(lbl => renderLabel(lbl))}
        </select>
        
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