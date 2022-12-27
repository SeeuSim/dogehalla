import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { authOptions } from "server/auth/session";
import { nextConnectOptions } from "server/auth/nextConnect";

const handler = nextConnect(nextConnectOptions).use(...authOptions);

handler.delete(async (req: NextApiRequest & { session: any }, res: NextApiResponse) => {

  await req.session.destroy();
  console.log(req.session)
  res.status(204).end();
});

export default handler;

