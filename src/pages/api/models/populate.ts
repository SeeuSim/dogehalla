import { NextApiRequest } from "next";
import nextConnect from "next-connect";

import { RoleEnumType } from "@prisma/client";

import { prisma } from "server/db/client";
import { nextConnectOptions } from "server/auth/nextConnect";
import { authOptions } from "server/auth/session";

import { populateDb } from "server/common/mnemonic/models";

const handler = nextConnect(nextConnectOptions);
handler.use(...authOptions);

handler.post(
  async (req: NextApiRequest & { user: any}, res) => {
    const uid = req.user.id;

    const userRecord = await prisma.user.findUnique({
      where: {
        id: uid
      }
    });

    if (userRecord?.role != RoleEnumType.admin) {
      return res.status(401).json({ message: "Forbidden" })
    }

    //Is admin, proceed to populate database
    await populateDb();

    return res.status(200).json({ message: "ok" });
  }
)

handler.delete(
  async (req: NextApiRequest & { user: any}, res) => {
    const uid = req.user.id;

    const userRecord = await prisma.user.findUnique({
      where: {
        id: uid
      }
    });

    if (userRecord?.role != RoleEnumType.admin) {
      return res.status(401).json({ message: "Forbidden" })
    }

    await prisma.collection.deleteMany({});
    await prisma.rankTable.deleteMany({});

    return res.status(200).json({ message: "ok"});
  }
)

export default handler;