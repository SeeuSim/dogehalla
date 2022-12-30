import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "argon2";

import { prisma } from "server/db/client";
import { BASEURL } from "utils/base";

type SignUpData = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

async function validateRegForm(data: SignUpData) {
  if (!data.email) {
    return {status: false, user: null};
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
    return {status: false, user: existingUser.email};
  }

  return {status: true, user: null};
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    let rawData = await req.body;
    const data = JSON.parse(JSON.stringify(rawData));
    const canRegister = await validateRegForm(data);
    if (canRegister.status) {
      const userProfile: SignUpData = data;
      const hashedPwd = await hash(userProfile.password);

      //Create User
      const user = await prisma.user.create({
        data: {
          email: userProfile.email,
          name: `${userProfile.firstName} ${userProfile.lastName}`,
          password: hashedPwd
        }
      });

      //Redirect and generate magic link
      const genLink = await fetch(`${BASEURL}/api/auth/signup/token`, {
        method: "POST", 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destination: {
            email: user.email,
            name: user.name
          },
          name: user.name
        })
      });

      const rs = await genLink.text();
      //Redirect base off of rs
      return res.status(200).json({rs});
    } else if (canRegister.user){
      //User Exists
      res.status(409).json({message: `User with email ${canRegister.user} already exists`});
    } else {
      res.status(405).json({message: "Email was not supplied"})
    }
  } else {
    res.status(405).json({message: "Bad Request"});
  }
}
