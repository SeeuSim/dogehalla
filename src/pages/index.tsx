import { type NextPage, GetServerSideProps } from "next";
import Head from "next/head";

import CollectionsDash from "./(home-components)/collectionsDash";

import { type Session } from "server/trpc/context";
import { trpc } from "utils/trpc";

//Experimental SSR/SSG
// const Home: NextPage<{session: Session}> = ({ session } : { session : Session}) => {
const Home: NextPage = () => {
  const { data: session } = trpc.auth.getSession.useQuery(
    undefined
  );
  
  return (
    <>
      <Head>
        <title>DogeTTM</title>
      </Head>
      <CollectionsDash/>
      {JSON.stringify(session)}
    </>
  );
};

export default Home;
