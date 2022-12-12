"use client"
import { signIn } from "next-auth/react";

type OAuthButtonProps = {
  logoImg: string,
  provider: string,
  providerName: string
}

export default function OAuthButton(props: OAuthButtonProps) {
  return (
    <button type="submit" 
            className={`
              flex items-center justify-center
              w-full 
              text-gray-900 dark:text-white 
              bg-inherit hover:bg-gray-50 
              border border-gray-300 
              dark:border-gray-600
              focus:ring-4 focus:outline-none 
              focus:ring-blue-300 
              font-medium rounded-lg 
              text-sm px-5 py-2.5 text-center 
              dark:hover:bg-gray-700 dark:focus:ring-blue-800
            `}
            onClick={() => signIn(props.provider)}>
              <img className="h-6 w-6" src={props.logoImg}/>&nbsp;&nbsp;Login with{` ${props.providerName}`}
            </button>
  );
}