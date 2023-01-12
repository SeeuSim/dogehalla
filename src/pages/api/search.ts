import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST" :
      const data = await req.body;
      const rawBody = JSON.parse(data);
      const address = rawBody.collectionAddress;

      if (!address) return res.status(405).json({ message: "Invalid search" })

      const outAddr = new URL(`/collection/${address}`, req.headers.origin).toString();
      return res.status(200).json({url: outAddr})
    default: 
      return res.status(400).json({ message: "Not supported"})
  }
}