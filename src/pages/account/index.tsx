import Head from "next/head";
import Link from "next/link";
import { NextApiRequest, NextApiResponse } from "next";

import { getSession } from "server/auth/session";

/**
 * More work is needed for this UI
 */
export default function Account({user}: {user: {name: string, image: string, id: string}}) {
  return (
    <div>
      <Head>
        <title>Account | DogeTTM</title>
      </Head>
      <ul>
      <li>My Assets</li>
      <li><Link href="/account/settings">Settings</Link></li>
      </ul>
    </div>
  )
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
    redirect: { destination: "auth/login", permanent: true }
  };
}