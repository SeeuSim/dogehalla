import Head from "next/head";
import { useSession, signOut } from "next-auth/react";
import OAuthButton from "components/buttons/OAuthButton";

const labelStyle = "block mb-2 text-sm font-medium text-gray-900 dark:text-white"
const fieldStyle = `
  bg-gray-50 
  border border-gray-300 
  text-gray-900 sm:text-sm 
  rounded-lg 
  focus:ring-blue-600 focus:border-blue-600 
  block w-full p-2.5 
  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
`

export default function Page() {
  const { data: session } = useSession();

  if (session) {
    const emailAddr = session.user?.email 
      ? session.user.email
      : "random user"

    return (
      <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0">
        <p className="text-gray-800 dark:text-white text-center">
          Signed in as <br/><a className="text-blue-500" href={`mailto:${emailAddr}`}>{emailAddr}</a> <br />
        </p>
        {/* <UserInformation data={session.user} /> */}
        <button className="border border-gray-500 rounded px-3 py-1 text-gray-800 dark:text-white " onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  //Sign in Form
  return (
    <div className="">
      <Head>
        <title>{`Login | DogeTTM`}</title>
      </Head>
      <div className="flex flex-col items-center mx-auto md:h-screen lg:py-0 bg-inherit">
        {/** Main Form */}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

            {/** Sign In Header */}
            <h2 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Welcome back
            </h2>

            {/** OAuth Form */}
            <OAuthButton logoImg="https://freesvg.org/img/1534129544.png" provider="google" providerName="Google" copytext="Login"/>
            <OAuthButton logoImg="https://avatars.githubusercontent.com/u/18060234?s=280&v=4" provider="coinbase" providerName="Coinbase" copytext="Login"/>

            {/** Separator */}
            <div className="flex items-center justify-between">
              <hr className="mx-auto w-36 h-0.5 bg-gray-100 rounded border-0 dark:bg-gray-700"/>
              <div className="dark:text-gray-400 font-medium">or</div>
              <hr className="mx-auto w-36 h-0.5 bg-gray-100 rounded border-0 dark:bg-gray-700"/>
            </div>

            {/** Manual Form */}
            <form className="space-y-4 md:space-y-6" action="#">
                <div>
                    {/** Email */}
                    <label htmlFor="email" 
                          className={labelStyle}>Your email</label>
                    <input type="email" 
                          name="email" 
                          id="email" 
                          className={fieldStyle}
                          placeholder="name@company.com"
                          required={true}/>
                </div>
                <div>
                    {/** Password */}
                    <label htmlFor="password" className={labelStyle}>Password</label>
                    <input type="password" 
                          name="password" 
                          id="password" 
                          placeholder="••••••••" 
                          className={fieldStyle} 
                      required={true}/>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      {/** Remember Me */}
                        <div className="flex items-center h-5">
                          <input id="remember" 
                                aria-describedby="remember" 
                                type="checkbox" 
                                className={`
                                  w-4 h-4
                                  border border-gray-300 rounded 
                                  bg-gray-50 
                                  focus:ring-3 focus:ring-blue-300 
                                  dark:bg-gray-700 dark:border-gray-600 
                                  dark:focus:ring-blue-600 dark:ring-offset-gray-800
                                `} 
                                required={false}/>
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                        </div>
                    </div>
                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">Forgot password?</a>
                </div>
                <button type="submit" 
                        className={`
                          flex items-center justify-center
                          w-full 
                          text-white 
                          bg-blue-600 hover:bg-blue-700 
                          focus:ring-4 focus:outline-none 
                          focus:ring-blue-300 
                          font-medium rounded-lg 
                          text-sm px-5 py-2.5 text-center 
                          dark:bg-blue-600 dark:hover:bg-blue-700 
                          dark:focus:ring-blue-800
                        `}>
                          Sign in to your account
                        </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Don{`'`}t have an account yet?{" "}
                    <a href="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                      Sign up here
                    </a>
                </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}