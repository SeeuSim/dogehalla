import { type NextPage, GetServerSideProps } from "next";
import Head from "next/head";

import CollectionsDash from "./(home-components)/collectionsDash";

import type { SessionProps } from "types/sessions";

const Home: NextPage<{session: SessionProps}> = ({ session } : { session : SessionProps}) => {
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
