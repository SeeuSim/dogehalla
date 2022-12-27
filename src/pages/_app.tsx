import { type AppType } from "next/app";

import { trpc } from "utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Header from "components/header";
import NavBar from "components/navbar";

import "styles/globals.css";

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <>
      <Header/>
      <main className="min-h-screen max-h-full overflow-scroll py-16 px-2 justify-center items-center bg-gray-100 dark:bg-slate-900">
        <NavBar/>
        <Component {...pageProps} />
      </main>
      <ReactQueryDevtools initialIsOpen={false}/>
    </>
  );
};

export default trpc.withTRPC(MyApp);
