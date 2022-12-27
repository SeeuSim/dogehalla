import { type NextPage } from "next";
import Head from "next/head";

import CollectionsDash from "./(home-components)/collectionsDash";

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>DogeTTM</title>
      </Head>
      <CollectionsDash/>

    </>
  );
};

export default Home;

