import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db/client";

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
    let data = await req.body;
    data = JSON.parse(data);
    const canRegister = await validateRegForm(data);
    if (canRegister.status) {
      //Create User

      //Send Response
      res.status(200).json({message: "Registration successful"});
    } else if (canRegister.user){
      //User Exists
      res.status(409).json({message: `User with email ${canRegister.user} already exists`});
    } else {
      res.status(405).json({message: "Email was not supplied"})
    }
  } else {
    console.log("from Backend: fail 3")
    res.status(405).json({message: "Bad Request"});
  }
}
