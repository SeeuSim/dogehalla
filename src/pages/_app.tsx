import { type AppType } from "next/app";

import { trpc } from "utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "components/header";
import NavBar from "components/navbar";

import "styles/globals.css";
import { SessionProps } from "types/sessions";

const queryclient = new QueryClient();

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <QueryClientProvider client={queryclient}>
      <Header/>
      <main className="min-h-screen max-h-full py-16 px-2 justify-center items-center bg-gray-100 dark:bg-slate-900 overflow-x-clip">
        <NavBar/>
        <Component {...pageProps}/>
      </main>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
};

export default trpc.withTRPC(MyApp);
