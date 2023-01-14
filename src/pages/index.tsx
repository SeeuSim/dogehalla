import type { NextPage } from "next";
import Head from "next/head";

import CollectionsDash from "./(home-components)/collectionsDash";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>NFinsighT</title>
      </Head>
      <div className="w-full">
        <CollectionsDash/>
      </div>
    </>
  );
};

export default Home;
