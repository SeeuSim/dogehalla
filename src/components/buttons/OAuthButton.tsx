import { useRouter } from "next/router";

type OAuthButtonProps = {
  logoImg: string,
  provider: string,
  providerName: string,
  copytext: string, 
}

export default function OAuthButton(props: OAuthButtonProps) {
  const router = useRouter();
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
            onClick={() => router.push(`/api/auth/client/${props.provider}`)}>
      <img className="h-6 w-6" src={props.logoImg}/>&nbsp;&nbsp;{`${props.copytext} `}with{` ${props.providerName}`}
    </button>
  );
}