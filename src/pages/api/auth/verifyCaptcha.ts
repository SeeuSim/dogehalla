import { NextApiRequest, NextApiResponse } from "next";
import { env } from "env/server.mjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      const { token } = req.body;
      const apiRes = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${env.RECAPTCHA_SITE_SECRET}&response=${token}`,
        {
          method: "POST"
        }
      );
      if (apiRes.ok) {
        return res.status(200).json({ message: "Human 👨 👩"});
      }
      return res.status(400).json({ message: "Robot 🤖"});
  }
}