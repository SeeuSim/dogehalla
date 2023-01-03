import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Head from "next/head";
import { getSession } from "server/auth/session";
import AccountDash from "./(account-components)/accountDash";


/**
 * Due to Middleware, this page will always be authenticated. Can proceed to fetch data
 */
const Account: NextPage<{ user: {name: string, id: string, image: string}}> = ({ user} : { user: {name: string, id: string, image: string}}) => {
  const data = JSON.stringify(user);
  return (
    <>
      <Head>
        <title>Account | DogeTTM</title>
      </Head>
      <div className="flex flex-col items-center px-2">
        <AccountDash/>
      </div>
      {/* <code className="flex-wrap text-gray-900 dark:text-slate-100">{data}</code> */}
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

  //Never called, `middleware.ts` blocks navigation here if the session cookie does not exist.
  return {
    redirect: { destination: "/auth/login", permanent: true }
  };
}

export default Account;