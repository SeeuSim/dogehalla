import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Searchbar from "./searchBar";

export default function SearchDropDown() {
  return (
    <Popover className="relative">
      {
        ({open, close}) => (
          <>
            <Popover.Button className={`group inline-flex items-center rounded-md px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none `}>
              <MagnifyingGlassIcon className={`h-5 w-5 text-gray-500 dark:text-white transition duration-150 ease-in-out group-hover:text-opacity-80`}
              aria-hidden="true" />
              <span className="sr-only">Search</span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
              >
              <Popover.Panel className="fixed right-0 mt-2 drop-shadow">
                <div className="z-10 mt-1 ml-1 [width:96vw] md:[width:33rem] transform px-2">
                  <Searchbar fn={close}/>
                </div>
                {/* <div className="h-2"></div> */}
              </Popover.Panel>
            </Transition>
          </>)
      }
    </Popover>
  );
}