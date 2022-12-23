import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { prisma } from "../../../server/db/client";

type SignUpData = {
  first: string,
  last: string,
  email: string,
  password: string,
  confirmPassword: string
}

async function validateRegForm(data: SignUpData) {
  if (!data.email) {
    return false;
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email
    }, 
    select: {
      email: true,
      name: true
    }
  });

  if (existingUser) {
    return false;
  }

  return true;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const router = useRouter();
    let data = await req.body;
    data = JSON.parse(JSON.stringify(data));

    const canRegister = await validateRegForm(data);
    if (canRegister) {
      res.status(200).json({message: "registration successful"});
      router.push("/");
    } else {
      res.status(405).json({message: "user exists"});
      router.push("/signup");
    }

  } else {
    res.status(405).json({message: "Bad Request"});
  }
}
