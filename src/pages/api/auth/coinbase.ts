import passport from "server/auth/passport";
import nextConnect from "next-connect";

export default nextConnect().use(passport.initialize())
  .get(
    passport.authenticate("coinbase", {
      failureRedirect: "/"
    })
  );
