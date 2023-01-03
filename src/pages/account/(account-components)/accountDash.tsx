import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, ShieldCheckIcon, WalletIcon } from "@heroicons/react/24/outline";
import { type Dispatch, type SetStateAction, useState } from "react";

/**
 * Mobile: Dropdown Nav select
 * Tablet or larger: Horizontal Nav with tabs
 */
const settings = [
  {
    name: "Security",
    sections: [
      {
        name: "Password"
      },
      {
        name: "Single-Sign-On (SSO)"
      }
    ],
    icon: () => {
      return (
        <ShieldCheckIcon className="h-5 w-5"/>
      );
    }
  },
  {
    name: "Assets",
    sections: [

    ],
    icon: () => {
      return (
        <WalletIcon className="h-5 w-5"/>
      );
    }
  },
];

const renderNav = ({label, active, index, set}: {label: string, active: boolean, index: number, set: Dispatch<SetStateAction<number>>}) => {
  return (
    <li className="mr-2" key={index}>
      <a href="#"
          className={`
            inline-block p-4 rounded-t-lg border-b-2
            ${active
              ? `text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500` 
              : `text-gray-800 border-transparent hover:text-gray-600 
              hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300`
            }`}
          aria-current={active ? "page" : "false"}
          onClick={() => set(index)}
        >
        {label}
        </a>
    </li>
  );
};

export default function AccountDash() {
  const [main, setMain] = useState(0);

  return (
    <div className={`
          mx-2 px-2 w-full sm:max-w-xl
          bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700`}>

      {/* Nav Section - Mobile */}
      <div className="block sm:hidden w-full border-b-[1px] border-b-gray-700 h-10">
        <Listbox as="div" className="relative">
          {({open}) => (
          <>
          <Listbox.Button className="relative p-2 text-gray-600 dark:text-slate-200 inline-flex justify-between w-full">
            <div className="inline-flex space-x-2 self-center">
              {settings[main]?.icon()}
              <span className="self-center -translate-y-0.5">{settings[main]?.name}</span>
            </div>
            <ChevronDownIcon className={`h-5 w-5 transition-transform ${open? "rotate-180 transform": ""}`}/>
          </Listbox.Button>
          <Listbox.Options className={`${open
              ? "mt-2 flex flex-col p-2 bg-gray-100 dark:bg-gray-800 rounded-md shadow dark:border dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-600" 
              : "hidden"}`}>
            {settings.map((i, idx) => 
              <Listbox.Option className={`text-gray-800 dark:text-slate-200
                                          inline-flex space-x-2 ${idx === main ? "hidden" : ""}`}
                              key={idx}
                              value={i.name}
                              onClick={() => {
                                setMain(idx);
                              }}>
                <i.icon/>
                <span className="-translate-y-0.5">{i.name}</span>
              </Listbox.Option>
            )}
          </Listbox.Options>
          </>)}
        </Listbox>
      </div>

      {/* Nav Section - Tablet/Desktop */}
      <div className="text-sm hidden sm:block font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {settings.map((i, idx) => 
            renderNav({
              label: i.name, 
              active: idx === main, 
              index: idx, 
              set: setMain
            }))}
        </ul>
      </div>
      {/* Actual Settings */}
      <div>
        <code>{JSON.stringify(settings[main]?.sections)}</code>
      </div>
    </div>
  );
}