import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import { authOptions } from "server/auth/session";
import { nextConnectOptions } from "server/auth/nextConnect";

import { prisma } from "server/db/client";
import { BASEURL } from "utils/base";

const handler = nextConnect(nextConnectOptions).use(...authOptions);

handler.post(async (req: NextApiRequest & { user: { id: string } }, res: NextApiResponse) => {
  if (!req.user) { //unauthenticated
    return res.status(401).json({message: "Unauthorized"});
  }

  if (!req.body || !req.body["provider"]) { //Ensure authed user posts the desired provider (Coinbase or Google)
    return res.status(405).json({message: "Bad Request"});
  }

  const uid = req.user.id;

  try {
    const linkedUser = await prisma.user.update({
      where: {
        id: uid
      },
      data: {
        canLink: true
      }
    });

    return res.status(200).json({ message: "ok" });
  } catch (err) {
    res.setHeader("error", new String(err).valueOf());
    return res.redirect(`${BASEURL}/account/settings`);
  }
});

export default handler;


