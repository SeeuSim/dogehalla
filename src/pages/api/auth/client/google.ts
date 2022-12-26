import nextConnect from "next-connect";
import passport from "server/auth/passport";

export default nextConnect().use(passport.initialize())
  .get(
    passport.authenticate("google", {
      failureRedirect: "/"
    })
  );
