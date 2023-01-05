import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { authOptions } from "server/auth/session";
import { nextConnectOptions } from "server/auth/nextConnect";

import type { Session } from "next-session/lib/types";

const handler = nextConnect(nextConnectOptions).use(...authOptions);

handler.delete(async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
  await req.session.destroy();
  res.status(204).end();
});

export default handler;

