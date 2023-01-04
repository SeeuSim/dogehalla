import { NextApiRequest, NextApiResponse, NextPage } from "next";
import Head from "next/head";
import SettingsDash from "./(settings-components)/accountSettingsDash";

//getServerSideProps only
import { getSession } from "server/auth/session";
import { prisma } from "server/db/client";
import { OAuthProfile } from "@prisma/client";


/**
 * Due to Middleware, this page will always be authenticated. Can proceed to fetch data
 */
const AccountSettings: NextPage<{ 
  user: {
    name: string, 
    id: string, 
    image: string
  },
  oauths: OAuthProfile[]
}> = ({ user, oauths } : { user: {name: string, id: string, image: string}, oauths: OAuthProfile[] }) => {
  const data = JSON.stringify(user);
  return (
    <>
      <Head>
        <title>Account Settings | DogeTTM</title>
      </Head>
      <div className="flex flex-col items-center px-2">
        <SettingsDash oauths={oauths}/>
      </div>
      {/* <code className="flex-wrap text-gray-900 dark:text-slate-100">{data}</code> */}
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

      }
    })

    return {
      props: {
        user: userProp,
        oauths: authProfiles
      }
    }
  }

  //Never called, `middleware.ts` blocks navigation here if the session cookie does not exist.
  return {
    redirect: { destination: "/auth/login", permanent: true }
  };
}

export default AccountSettings;