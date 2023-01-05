import { useState } from 'react';
import Link from 'next/link';

import { trpc } from 'utils/trpc';

import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import AccountDropdown from './accountDropdown';
import SearchDropDown from './searchDropdown';

//TO BE CHANGED
const dogeLogo = "https://flowbite.com/docs/images/logo.svg";

const menuOptions = [
  { name: 'Home', href: '/' },
  { name: 'Analytics', href: '#' },
  { name: 'Account', href: '/account' },
]

const Logo = () => {
  return (
    <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
      <Link href="/" className="flex items-center">
        <img src={dogeLogo} className="h-6 mr-3 sm:h-9" alt="DogeTTM"/>
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">DogeTTM</span>
      </Link>
    </div>
  );
}

export default function NavBar(): JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: session } = trpc.auth.getSession.useQuery(undefined);
  

  return (
    <div className="px-6 pt-2 lg:px-8">
      {/** Large Screens and Above */}
      <nav className={`
            ${mobileMenuOpen? "hidden" : ""}
            bg-white border-gray-200
            px-2 sm:px-4 py-2.5 rounded dark:bg-gray-900
            fixed w-full z-20 
            top-0 left-0 border-b dark:border-gray-700
            `} 
           aria-label="Global">
        <div className="flex h-9 items-center justify-between">
          {Logo()}

          {/** Links */}
          <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:justify-center lg:space-x-8">
            {menuOptions.map((item) => (
              <Link key={item.name} href={item.href} 
                 className={`
                  block py-2 px-2 font-medium
                  text-blue-700 hover:text-blue-500
                  dark:text-white dark:hover:text-gray-400
                 `}>
                {item.name}
              </Link>
            ))}
          </div>

          {/** Search | Hamburger (Medium and below) | Login Button (Large only) */}
           
          <div className="flex min-w-0 flex-1 justify-end gap-x-2">
            <SearchDropDown/>
            <button
              type="button"
              className="-m-2.5 lg:hidden inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}>
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-white" aria-hidden="true" />
            </button>

            {/**If not logged in -> Display Log In button */}
            { session
              ? <AccountDropdown/>
              : <Link href="/auth/login/"
                      className={`
                          hidden
                          lg:inline-block rounded-lg px-3 py-1.5 
                          text-sm font-semibold leading-6 
                          text-gray-900 shadow-sm
                          dark:text-white 
                          ring-1 ring-gray-900/10 hover:ring-gray-900/20
                          dark:ring-gray-50/10 dark:hover:ring-gray-50/20
                        `}>
                      Log in
                </Link>
            }
          </div>
        </div>
      </nav>

      {/** Medium Screens and Below - Hamburger Menu */}
      <Dialog as="div" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <Dialog.Panel onFocus={() => {}} className="fixed inset-0 z-10 overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 lg:hidden">
          <div className="flex h-9 items-center justify-between">

            {/** Company Logo */}
            <div className="flex">
              <Link href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  className="h-8"
                  src={dogeLogo}
                  alt=""
                />
              </Link>
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
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => {setMobileMenuOpen(false)}}
                    className="-mx-3 block rounded-lg py-2 px-3 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-400/10 dark:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/** Login Button */}
              <div className="py-6">
                <Link
                  href="/auth/login/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mx-3 block rounded-lg py-2.5 px-3 text-base font-semibold leading-6 text-gray-900 hover:bg-gray-400/10 dark:text-white"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}