import { type AppType } from "next/app";

import { trpc } from "utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "components/header";
import NavBar from "components/navbar";

import "styles/globals.css";
import { useState } from "react";

const queryclient = new QueryClient();

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  //Theming
  const [darkMode, setDarkMode] = useState(true);

  return (
    <QueryClientProvider client={queryclient}>
      <Header/>
      <main className={`${ darkMode? "dark" : "light"}`}>
        <div className="min-h-screen h-max pt-16 pb-4 px-2 justify-center items-center bg-gray-100 dark:bg-slate-900 overflow-x-clip">
          <NavBar dark={darkMode} setDark={setDarkMode}/>
          <Component {...pageProps}/>
        </div>
      </main>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  );
};

export default trpc.withTRPC(MyApp);
