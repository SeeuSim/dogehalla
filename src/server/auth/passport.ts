import passport from "passport";
import { Strategy as CoinbaseStrategy } from "passport-coinbase";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { VerifyCallback } from "passport-google-oauth2";
import { Strategy as LocalStrategy } from "passport-local";

import argon2 from "argon2";
import session from "next-session";

import { trpc } from "utils/trpc";
import { prisma } from "server/db/client";

import { env } from "env/server.mjs";

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
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/callback/google",
      scope: ["email"],
      passReqToCallback: true,
    },
    async (request: any, accessToken: any, refreshToken: any, slug: GoogleOAuthSlug, profile: GoogleOAuthProfile, done: VerifyCallback) => {
      try {
        const authedUser = await prisma.oAuthProfile.findUnique({
          where: {
            provider_providerOAuthId: {
              provider: profile.provider,
              providerOAuthId: profile.id
            }
          }
        }); 

        if (!authedUser) { //Auth profile does not exist
          const user = await prisma.user.findUnique({
            where: {
              email: profile.email
            },
            select: {
              authprofiles: true
            }
          });

          if (!user) { // create
            console.log("Creating user " + profile.email);

          } else { //Check for existing profiles
            if (!user.authprofiles) {
              //No OAuth registered -> check for email and password
            }
            if (user.authprofiles.length != undefined && user.authprofiles.length > 0) {
              //OAuth registered -> Prompt to login and link
            }
          }
        }
        
        //create session with next-session and return session, user
        session()
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
    clientID: env.COINBASE_CLIENT_ID,
    clientSecret: env.COINBASE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/callback/coinbase",
    scope: ["wallet:user:email", "wallet:user:read"],
    
  },
  async (accessToken: any, refreshToken: any, profile: CoinbaseProfile, done: (error: any, user?: any, info?: any) => void) => {
    //Flow is roughly the same as Google, just that this provides created_at and does not provide expires_at
    try {
      console.log(JSON.stringify(profile._json) + `\n${accessToken}\n${refreshToken}`);
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

passport.serializeUser(function (user, callback) {
  process.nextTick(function() {
    callback(null, { user });
  });
});

passport.deserializeUser(function(user, callback) {
  process.nextTick(function() {
    return callback(null, user as Express.User);
  });
});

export default passport;