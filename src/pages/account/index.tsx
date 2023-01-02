import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import { getSession } from "server/auth/session";


/**
 * Due to Middleware, this page will always be authenticated. Can proceed to fetch data
 */
const Account: NextPage<{ user: {name: string, id: string, image: string}}> = ({ user} : { user: {name: string, id: string, image: string}}) => {
  if (user === null) {
    Router.replace("/auth/login");
  }

  const data = JSON.stringify(user);
  return (
    <>
      <Head>
      </Head>
      <div className="text-gray-700 dark:text-slate-200">
        {data}
      </div>
    </>
    );
}

export async function getServerSideProps({ req, res }: {req: NextApiRequest & {user: any}, res: NextApiResponse}) {
  const session = await getSession(req, res);

  if (session?.passport?.user) {
    const userProp = session.passport.user;
    
    return {
      props: {
        user: userProp
      }
    }
  }

  return {
    props: null
  };
}

export default Account;