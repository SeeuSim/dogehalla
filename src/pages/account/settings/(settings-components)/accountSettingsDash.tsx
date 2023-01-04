import { type Dispatch, type SetStateAction, useState } from "react";

import { Listbox } from "@headlessui/react";
import { ChevronDownIcon, ShieldCheckIcon, WalletIcon } from "@heroicons/react/24/outline";

import type { OAuthProfile } from "@prisma/client";

import Pane from "./pane";
import OAuthSettingsModal from "./oAuthSettingsModal";

const SettingsNav: React.FC<{
  label: string,
  active: boolean,
  index: number,
  icon: () => JSX.Element,
  set: Dispatch<SetStateAction<number>>
}> = (props) => {
  return (
    <li className="mr-2" key={props.index}>
      <button 
          className={`
            inline-flex p-4 rounded-t-lg border-b-2
            ${props.active
              ? `text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500` 
              : `text-gray-800 border-transparent hover:text-gray-600 
              hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300`
            }`}
          aria-current={props.active ? "page" : "false"}
          onClick={() => {
            props.set(props.index);
          }}
        >
        <props.icon/>
        {props.label}
      </button>
    </li>
  );
};

const OAuthManager: React.FC<{
  oauths: OAuthProfile[]
}> = (props) => {

  return (
    <div>
      {props.oauths.length === 0
        ? <p>No accounts linked yet.</p>
        : JSON.stringify(props.oauths)}
    </div>
  );
}

const SettingsDash: React.FC<{
  oauths: OAuthProfile[]
}> = (props) => {
  const [main, setMain] = useState(0);

  const [resetPasswordModal, closePasswordModal] = useState(false);

  const [linkOAuthModal, openOAuthModal] = useState(false);

    /**
   * Mobile: Dropdown Nav select
   * Tablet or larger: Horizontal Nav with tabs
   */
  const settings = [
    {
      name: "Security",
      icon: () => <ShieldCheckIcon className="h-5 w-5 mr-2"/>,
      sections: [
        {
          title: "Password",
          subPanes: [
            {
              type: "buttonSubPane",
              copytext: "Keep your password private and safe. It is recommended to store it offline.",
              button: {
                copytext: "Change password",
                href: "/account/settings/changePassword"
              }
            },
          ],
        },
        {
          title: "Single-Sign-On (SSO)",
          subPanes: [
            {
              type: "buttonSubPane",
              copytext: "Manage your passwordless login methods here.",
              button: {
                copytext: "Add SSO login",
                action: () => openOAuthModal(true),
                href: "/account/settings/linkOAuthProvider"

              }
            },
            {
              type: "OAuth Accounts Table",
              copytext: "Linked SSO accounts:",
              element: <OAuthManager oauths={props.oauths}/>,
            }
          ],
          
        }
      ],
      
    },
    {
      name: "Assets",
      icon: () => <WalletIcon className="h-5 w-5 mr-2"/>,
      sections: [
        {
          title: "In Progress",
          subPanes: [
            {
              copytext: "This feature is still in development. Check back later for further updates."
            }
          ]
        }
      ],
    },
  ];

  return (
    <div className={`
          mx-2 px-2 w-full sm:max-w-xl h-screen
          bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700`}>
      

      {/* Nav Section - Mobile */}
      <div className="block sm:hidden w-full border-b-[1px] border-b-blue-600 dark:border-b-blue-500 h-14">
        <Listbox as="div" className="relative">
          {({open}) => (
          <>
          <Listbox.Button className="relative px-2 py-4 text-blue-600 dark:text-blue-500 inline-flex justify-between w-full">
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
            <SettingsNav  label={i.name} 
                          active={idx === main} 
                          index={idx} 
                          icon={i.icon} 
                          set={setMain}/>)}
        </ul>
      </div>

      {/* Actual Settings */}
      <div>
        {settings[main]?.sections.map(
          (el) => <Pane title={el.title} subPanes={el.subPanes}></Pane>
        )}
      </div>
      
      <OAuthSettingsModal isOpen={linkOAuthModal} setOpen={openOAuthModal}/>
    </div>
  );
}

export default SettingsDash;