import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Head from "next/head";
import SettingsDash from "./(settings-components)/settingsDash";

import type { AuthedSessionProps } from "types/sessions";

//getServerSideProps only
import { getSession } from "server/auth/session";
import { prisma } from "server/db/client";

export type OAuthProfileProps = {
  created_at: string
  id: string,
  provider: string,
};



/**
 * Due to Middleware, this page will always be authenticated. Can proceed to fetch data
 */
const AccountSettings: NextPage<{ 
  user: AuthedSessionProps,
  oauths: OAuthProfileProps[]
}> = ({ user, oauths }) => {
  
  return (
    <>
      <Head>
        <title>Account Settings | DogeTTM</title>
      </Head>
      <div className="flex flex-col items-center px-2">
        <SettingsDash oauths={oauths} user={user}/>
      </div>
    </>
    );
}

export async function getServerSideProps({ req, res }: {req: NextApiRequest & {user: any}, res: NextApiResponse}) {
  const session = await getSession(req, res);

  if (session?.passport?.user) {
    const userProp = session.passport.user;
    const authProfiles = await prisma.oAuthProfile.findMany({
      where: {
        userId: userProp.id
      }, 
      select: {
        id: true,
        provider: true,
        created_at: true,
      }
    })

    return {
      props: {
        user: userProp,
        oauths: authProfiles.map((pf) => {
          return {
            id: pf.id,
            provider: pf.provider,
            created_at: pf.created_at.toISOString()
          }
        })
      }
    }
  }

  //Never called, `middleware.ts` blocks navigation here if the session cookie does not exist.
  return {
    redirect: { destination: "/auth/login", permanent: true }
  };
}

export default AccountSettings;