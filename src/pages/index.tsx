import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "utils/trpc";

import CollectionsDash from "./(home-components)/collectionsDash";

const Home: NextPage = () => {
  const { data: session } = trpc.auth.getSession.useQuery(undefined);

  return (
    <>
      <Head>
        <title>DogeTTM</title>
      </Head>
      <CollectionsDash/>
      { session &&
      <code className= "text-white">
        {JSON.stringify(session)}
      </code>}
    </>
  );
};

export default Home;
