import { type AppType } from "next/app";

import { trpc } from "utils/trpc";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Header from "components/header";
import NavBar from "components/navbar";

import "styles/globals.css";

const queryclient = new QueryClient();

//Make default theme dark. 
const theme = "dark" //TODO: Feed state as props to Navbar and visualThemeToggle component 

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <html className = {theme}>  
    <QueryClientProvider client={queryclient}>
      <Header/>
      <main className="min-h-screen h-max pt-16 pb-4 px-2 justify-center items-center bg-gray-100 dark:bg-slate-900 overflow-x-clip">
        <NavBar/>
        <Component {...pageProps}/>
      </main>
      <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
    </html>
  );
};

export default trpc.withTRPC(MyApp);