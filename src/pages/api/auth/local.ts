import { NextApiRequest, NextApiResponse } from "next";
import passport from "../../../server/auth/passport";

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    passport.authenticate(
      "local",
      {
        successReturnToOrRedirect: '/',
        failureRedirect: '/login',
        failureMessage: true
      },
      (err, user, message) => {
        if (err) {
          return response.status(400).json({ data: message});
        } 

        //Set session with `user`

        //Redirect
        response.redirect("/");
      }
    )
  } else {
    response.status(405).json({ message: "Bad request"});
  }
}