import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

import { authOptions } from "server/auth/session";
import { nextConnectOptions } from "server/auth/nextConnect";

import type { User } from "@prisma/client";
import { userAgent } from "next/server";

const handler = nextConnect(nextConnectOptions);
handler.use(...authOptions);
handler.get(async (req: NextApiRequest & { user: User}, res: NextApiResponse) => {
  if (!req.user || req.user === undefined) return res.status(200).json({user: null});
  return res.status(200).json({user: {name: req.user.name, image: req.user.image, id: req.user.id}});
});

export default handler;