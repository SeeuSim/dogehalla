"use client"

/**
 * Current Layout:
 * ----------------------------
 * | Logo | Links | Searchbar |
 * ----------------------------
 * ... rest of content ... 
 * 
 * Ideal Layout: (Flowbite Navbar Block with search section)
 * ----------------------------------------
 * | Logo | Links | Account circle        |
 * |      |       | (with expanding opts) |
 * ----------------------------------------
 * | Searchbar                            |
 * | (with dynamic dropdown -             |
 * |  label for ≥md, icon for sm)         |
 * ----------------------------------------
 * 
 */

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

// WIP
// import Searchbar from "./searchbar";

const menuOptions = [
  { name: 'Home', href: '/' },
  { name: 'Analytics', href: '#' },
  { name: 'Account', href: '/login/' },
]

const dogeLogo = "https://flowbite.com/docs/images/logo.svg";

const Logo = () => {
  return (
    <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
      <a href="/" className="flex items-center">
        <img src={dogeLogo} className="h-6 mr-3 sm:h-9" alt="DogeTTM"/>
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">DogeTTM</span>
      </a>
    </div>
  );
}

export default function NavBar(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="px-6 pt-6 lg:px-8">
      {/** Large Screens and Above */}
      <nav className={`
            ${mobileMenuOpen? "hidden" : ""}
            bg-white border-gray-200 
            px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900
            fixed w-full z-20 
            top-0 left-0 border-b dark:border-gray-700
            `} 
           aria-label="Global">
        <div className="container flex flex-wrap items-center justify-between lmx-auto">
          {Logo()}

          {/** Hamburger Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/** Links */}
          <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center lg:space-x-8">
            {menuOptions.map((item) => (
              <a key={item.name} href={item.href} 
                 className={`
                  block py-2 px-2 font-medium
                  text-blue-700 hover:text-blue-500
                  dark:text-white dark:hover:text-gray-400
                 `}>
                {item.name}
              </a>
            ))}
          </div>

          {/** Login Button */}
          <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-end">
            <a href="/login/"
               className={`
                  inline-block rounded-lg px-3 py-1.5 
                  text-sm font-semibold leading-6 
                  text-gray-900 shadow-sm
                  dark:text-white 
                  ring-1 ring-gray-900/10 hover:ring-gray-900/20
                  dark:ring-gray-50/10 dark:hover:ring-gray-50/20
                `}>
              Log in
            </a>
          </div>
        </div>
      </nav>

      {/** Medium Screens and Below - Hamburger Menu */}
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Dialog.Panel onFocus={() => {}} className="fixed inset-0 z-10 overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 lg:hidden">
          <div className="flex h-9 items-center justify-between">

            {/** Company Logo */}
            <div className="flex">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8"
                  src={dogeLogo}
                  alt=""
                />
              </a>
            </div>

            {/** Close Menu Button */}
            <div className="flex">
              <button
                type="button"
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/** Links */}
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {menuOptions.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10 dark:text-white"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/** Login Button */}
              <div className="py-6">
                <a
                  href="/login/"
                  className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10 dark:text-white"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
