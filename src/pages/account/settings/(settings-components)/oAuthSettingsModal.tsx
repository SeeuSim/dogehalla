import { useRouter } from "next/router";
import { Dispatch, Fragment, SetStateAction } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import OAuthButton from "components/buttons/OAuthButton";
import { BASEURL } from "utils/base";

const ModalUI: React.FC<{
  closeButton: JSX.Element
}> = ({closeButton}) => {

  const router = useRouter();

  const linkOAuthCallback =  async (authProvider: string) => {
    const response = await fetch(`${BASEURL}/api/auth/linkAuth`, {
      method: "POST", 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        provider: authProvider
      })
    });
    if (response === undefined || !response.ok) {
      //Toast error TODO: Convert to toast
      console.log(response.statusText);
    } else { //Prompt to login
      router.push(`/api/auth/client/${authProvider}`);
    }
  }

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-700 shadow-md rounded-md px-2">
      <div className="relative items-end py-2">
        {closeButton}
      </div>
      <div>
        <h1 className="py-4 font-semibold text-md dark:text-slate-100">Link OAuth Providers:</h1>
      </div>
      <div className="px-2 pb-4 space-y-3">
        <OAuthButton 
          logoImg="https://freesvg.org/img/1534129544.png" 
          provider="google" 
          providerName="Google" 
          copytext="Continue"
          action={() => linkOAuthCallback("google")}
        />
        <OAuthButton 
          logoImg="https://avatars.githubusercontent.com/u/18060234?s=280&v=4" 
          provider="coinbase" 
          providerName="Coinbase" 
          copytext="Continue"
          action={() => linkOAuthCallback("coinbase")}
        />
      </div>  
    </div>
  );
}

const OAuthSettingsModal: React.FC<{
  isOpen: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}> = (props) => {
  
  const { isOpen, setOpen } = props;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        open={isOpen} 
        onClose={() => setOpen(false)}
        className="relative z-50"
        >
        <Transition.Child //Set the background
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto"  onClick={() => setOpen(false)}>
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child //Set the modal itself
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
              >
              {/* Actual Modal Body */}
              <div className="mt-4">
                <ModalUI closeButton={
                    <button
                      type="button"
                      className="absolute right-0 dark:text-gray-200 dark:hover:text-gray-50 hover:shadow-lg hover:z-50"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only border font-bold">Close Modal</span>
                      <XMarkIcon className="h-5 w-5 hidden sm:block"/>
                    </button>
                  }/>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default OAuthSettingsModal;