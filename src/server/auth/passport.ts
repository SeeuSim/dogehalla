import passport from "passport";
import { Strategy as CoinbaseStrategy } from "passport-coinbase";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as LocalStrategy } from "passport-local";

import argon2 from "argon2";
import { trpc } from "utils/trpc";

type GoogleOAuthSlug = {
  access_token: string,
  expires_in: number,
  scope: string,
  token_type: string,
  id_token: string
}

type GoogleOAuthProfile = {
  provider: string,
  id: string,
  name: {
    givenName: string, 
    familyName: string
  },
  email: string,
  picture: string
}

type CoinbaseProfile ={
  _json: {
    id: string,
    name: string,
    username?: string,
    avatar_url: string,
    
    email: string,
    
    created_at: number | string //'2022-12-12T07:51:14Z',
    
    user_type: string // Preferably enum - 'individual'
  }
}

//Google
passport.use(
  "google", 
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:3000/api/auth/callback/google",
      passReqToCallback: true,
    },
    async (request: any, accessToken: any, refreshToken: any, slug: GoogleOAuthSlug, profile: GoogleOAuthProfile, done: any) => {
      try {
        const authedUser = await trpc.model.oauth.getOAuthProfileOwner.useQuery({
          provider: profile.provider,
          providerOAuthId: profile.id
        });

        if (!authedUser) { //Auth profile does not exist
          const user = await trpc.model.user.getUser.useQuery({
            email: profile.email
          });

          if (!user) { // create

          } else { //Check for existing profiles
            if (!user.data?.authprofiles) {
              //No OAuth registered -> check for email and password
            }
            if (user.data?.authprofiles.length != undefined && user?.data.authprofiles.length > 0) {
              //OAuth registered -> Prompt to login and link
            }
          }
        }
        
        //create session with next-session and return session, user
        done(null, false, {message: "logging"});

      } catch (err) {
        console.error(err);
        done(err, false, { message: "Internal Server Error"});
      }
    }
  )
);

//Coinbase
passport.use(
  "coinbase",
  new CoinbaseStrategy({
    clientID: process.env.COINBASE_CLIENT_ID as string,
    clientSecret: process.env.COINBASE_CLIENT_SECRET as string,
    callbackURL: "http://localhost:3000/api/auth/callback/coinbase",
    scope: ["wallet:user:email", "wallet:user:read"]
  },
  async (accessToken: any, refreshToken: any, profile: CoinbaseProfile, done: any) => {
    //Flow is roughly the same as Google, just that this provides created_at and does not provide expires_at
    try {
      console.log(profile);
      done(null, false, {message: "testing"})
    } catch (err) {
      done(err, false, { message: "Internal Server Error"});
    }
  })
);

//Local Strategy
passport.use(new LocalStrategy(
  async (username: string, password: string, callback: any) => {
    const fail = callback("Error", false, { message: 'Incorrect username or password' });
    try {
      const user = await trpc.model.user.getVerifyUser.useQuery({email: username});
      
      //Hashing should be transferred to login form - at later date
      const hashedPassword = await argon2.hash(password);

      if (!user || hashedPassword != user.data?.password) {
        return fail;
      }

      return callback(null, {
        email: user.data.email, 
        name: user.data.name
      });

    } catch (err) {
      //Error logging should be turned off in production
      //return fail;
      return callback(err, false, { message: err });
    }
  }
))

export default passport;