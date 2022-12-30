import { NextPage } from "next";
import Head from "next/head";


/**
 * Due to Middleware, this page will always be authenticated. Can proceed to fetch data
 */
const Account: NextPage<{session: null}> = ({ session }) => {

  return (
    <>
      <Head>
      </Head>
      <div>
        Hello From Accounts Page
      </div>
    </>
    );
}

export default Account;