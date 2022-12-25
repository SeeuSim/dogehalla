import nextConnect from "next-connect";
import passport from "server/auth/passport";
import { NextApiRequest, NextApiResponse } from "next";

export default nextConnect().get(
  passport.authenticate("coinbase", {
    failureRedirect: "/login"
  }),
  (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
    // you can save the user session here. to get access to authenticated user through req.user
    res.redirect("/");
  }
);