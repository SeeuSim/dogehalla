import { NextApiRequest, NextApiResponse, NextPage } from "next";
import { getSession } from "server/auth/session";
import { prisma } from "server/db/client";
import { RoleEnumType } from "@prisma/client";
import { useState } from "react";
import { BASEURL } from "utils/base";
import { CogIcon } from "@heroicons/react/24/outline";

const AdminPage: NextPage<{
  name: string,
  id: string,
  image: string
}> = (props) => {

  const [ploading, psetLoading] = useState(false);
  const [dloading, dsetLoading] = useState(false);

  const populateBtnCallback = async () => {
    psetLoading(true);
    const res = await fetch(`${BASEURL}/api/models/populate`,
      {
        method: "POST",
        body: JSON.stringify({
          "X-API-Authenticate": ""
        }),
      }
    );
    console.log(res);
    psetLoading(false);
  };

  const deleteBtnCallback = async () => {
    dsetLoading(true);
    const res = await fetch(`${BASEURL}/api/models/populate`,
      {
        method: "DELETE",
        body: JSON.stringify({
          "X-API-Authenticate": ""
        }),
      }
    );
    console.log(res);
    dsetLoading(false);
  }

  return (
    <div className="items-center justify-center">
      { ploading
        ? <button
            disabled={true}
            className={`
              inline-flex items-center justify-center
              w-full space-x-2
              font-medium rounded-lg 
              text-sm px-5 py-2.5 text-center
              bg-slate-300 dark:bg-slate-800
              hover:bg-slate-500 dark:hover:bg-slate-600
              text-slate-900 dark:text-slate-200 
            `}
          >
            <CogIcon className="h-6 w-6 animate-spin"/>
            <p>Loading</p>
          </button>
        : <button type="submit"
            className={`
              flex items-center justify-center
              w-full 
              text-white 
              bg-blue-600 hover:bg-blue-700 
              focus:ring-4 focus:outline-none 
              focus:ring-blue-300 
              font-medium rounded-lg 
              text-sm px-5 py-2.5 text-center 
              dark:focus:ring-blue-800
            `}
            onClick={populateBtnCallback}
          >
            Populate Database
          </button>
      }
      { dloading
        ? <button
            disabled={true}
            className={`
              inline-flex items-center justify-center
              w-full space-x-2
              font-medium rounded-lg 
              text-sm px-5 py-2.5 text-center
              bg-slate-300 dark:bg-slate-800
              hover:bg-slate-500 dark:hover:bg-slate-600
              text-slate-900 dark:text-slate-200 
            `}
          >
            <CogIcon className="h-6 w-6 animate-spin"/>
            <p>Loading</p>
          </button>
        : <button type="submit"
            className={`
              flex items-center justify-center
              w-full translate-y-2
              text-white 
              bg-red-500
              focus:ring-4 focus:outline-none 
              focus:ring-red-300 
              font-medium rounded-lg 
              text-sm px-5 py-2.5 text-center 
              dark:focus:ring-red-800
            `}
            onClick={deleteBtnCallback}
            >
            Delete all data
          </button>
      }
    </div>
  );
}

export async function getServerSideProps({ req, res }: {req: NextApiRequest & {user: any}, res: NextApiResponse}) {
  const session = await getSession(req, res);

  if (session?.passport?.user) {
    const userProp = session.passport.user;

    const fromDb = await prisma.user.findUnique({
      where: {
        id: userProp.id
      }
    });

    if (fromDb?.role === RoleEnumType.admin) {
      return {
        props: {
          user: userProp
        }
      };
    }
      
  }

  //Never called, `middleware.ts` blocks navigation here if the session cookie does not exist.
  return {
    redirect: { destination: "/auth/login", permanent: true }
  };
}

export default AdminPage;