import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import { authOptions } from "server/auth/session";
import { nextConnectOptions } from "server/auth/nextConnect";

import type { User } from "@prisma/client";

const handler = nextConnect(nextConnectOptions);
handler.use(...authOptions);
handler.get(async (req: NextApiRequest & { user: User}, res: NextApiResponse) => {
  if (!req.user || req.user === undefined) return res.status(404);
  return res.status(200).json({user: {name: req.user.name, email: req.user.email, image: req.user.image}});
});

export default handler;