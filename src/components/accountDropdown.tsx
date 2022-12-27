import { Fragment } from "react";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Popover, Transition } from "@headlessui/react";
import { UserIcon } from "@heroicons/react/24/outline";


const solutions = [
  {
    name: 'Home',
    href: '##',
  },
  {
    name: 'Profile',
    href: '##',
  },
  {
    name: 'Analytics',
    href: '##',
  },
]

export default function Example() {
  const router = useRouter();
  const queryclient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (key) => {
      return fetch("/api/auth/logout", {method: "DELETE"});
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ['currentUser']});
      router.reload();
    }
  })

  const signout = () => mutation.mutate();

  return (
    <div className="flex">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md px-3 py-2 text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <UserIcon
                className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-opacity-80`}
                aria-hidden="true"
              />
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
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-1">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className=" dark:bg-gray-700 p-1">
                    <a
                      href="/"
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-medium  text-white">
                          Home
                        </span>
                      </span>
                    </a>
                  </div>
                <div className=" dark:bg-gray-700 p-1">
                    <a
                      href="##"
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-medium  text-white">
                          Search
                        </span>
                      </span>
                    </a>
                  </div>
                  <div className=" dark:bg-gray-700 p-1">
                    <a
                      href="##"
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                    >
                      <span className="flex items-center">
                        <span className="text-sm font-medium  text-white">
                          Analytics
                        </span>
                      </span>
                    </a>
                  </div>
                  <div className=" dark:bg-gray-700 p-1">
                    <button
                      onClick={signout}
                      className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                      <span className="flex items-center">
                        <span className="text-sm font-medium  text-white">
                          Sign Out
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}
