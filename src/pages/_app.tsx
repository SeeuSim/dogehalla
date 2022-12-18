import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import Header from "../components/header";
import NavBar from "../components/navbar";

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Header/>
      <main className="min-h-screen p-16 justify-center items-center bg-gray-100 dark:bg-slate-900">
        <NavBar/>
        <Component {...pageProps} />
      </main>
      <ReactQueryDevtools initialIsOpen={false}/>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
