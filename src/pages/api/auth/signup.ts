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

async function validateRegForm(emailAddr: string) {
  if (!emailAddr) {
    return {status: false, user: null};
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: emailAddr
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
    const data = JSON.parse(rawData);
    const canRegister = await validateRegForm(data.email);
    if (canRegister.status) {
      const userProfile: SignUpData = data;
      const hashedPwd = await hash(userProfile.password);

      //Create User -> Avoid passing around password -> But ban from login, and autodelete if not verified after 2 days.
      const user = await prisma.user.create({
        data: {
          email: userProfile.email,
          name: `${userProfile.firstName} ${userProfile.lastName}`,
          password: hashedPwd,
          verified: false
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
          }
        })
      });

      const rs = await genLink.text();
      //Redirect base off of rs
      if (genLink.ok) {
        return res.status(200).json({rs});
      } else {
        return res.status(500).json({rs});
      }
    } else if (canRegister.user){
      //User Exists
      return res.status(409).json({message: `User with ${canRegister.user} already exists. Please login with that email instead`});
    } else {
      //Will never happen, form validates requires email
      return res.status(405).json({message: "Email was not supplied"})
    }
  } else {
    return res.status(405).json({message: "Internal Server Error"});
  }
}
