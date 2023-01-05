import passport, { use } from "passport";
import { Strategy as CoinbaseStrategy } from "passport-coinbase";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth2";
import MagicLoginStrategy from "passport-magic-login";

import { Strategy as LocalStrategy } from "passport-local";

import argon2 from "argon2";

import { prisma } from "server/db/client";
import { env } from "env/server.mjs";

import type { User } from "@prisma/client";
import { mailer } from "server/common/mailer";
import { BASEURL } from "utils/base";

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

type CoinbaseProfile = {
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

passport.serializeUser((user, done) => {
  const dbUser = user as unknown as User;
  const out = { name: dbUser.name, id: dbUser.id, image: dbUser.image };
  done(null, out);
});

passport.deserializeUser(async (req: any, user: {name: string, id: string, image: string}, done: any) => {
  try {
    // const user = await prisma.user.findUnique({
    //   where: {
    //     email: id.email
    //   }
    // });
    done(null, user);
  } catch (err) {
    done(err);
  }
})

//Google
passport.use(
  "google", 
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/callback/google",
      scope: ["email", "profile"],
      passReqToCallback: true,
    },

    //Google OAuth Creation and Link or Login Routine
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
              authprofiles: true,
              canLink: true,
              id: true
            }
          });

          if (!user) { // create
            console.log("Creating user " + profile.email);
            
            const user = await prisma.user.create({
              data: {
                name: `${profile.name.givenName} ${profile.name.familyName}`,
                email: profile.email,
                image: profile.picture
              }
            });

            const authprofile = await prisma.oAuthProfile.create({
              data: {
                userId: user.id,
                type: "",//
                provider: profile.provider,
                providerOAuthId: profile.id,
                refresh_token: refreshToken,
                access_token: accessToken,
                expires_at: (slug.expires_in % (2 ** 32)) as number || 0,
                token_type: slug.token_type,
                scope: slug.scope,
                id_token: slug.id_token,
              }
            });
            done(null, user, { message: "User created successfully"});
          } else { //User exists
            if (user.canLink) {
              console.log("/////USER CAN LINK")
              //Check if existing profile with Google is linked to the user
              const googleProfileExists = user.authprofiles.filter(e => e.provider === "google").length > 0;

              const linkedUser = await prisma.user.update({
                where: {
                  id: user.id
                },
                data: {
                  canLink: false
                }
              });

              if (!googleProfileExists) {
                const authprofile = await prisma.oAuthProfile.create({
                  data: {
                    userId: linkedUser.id,
                    type: "",//
                    provider: profile.provider,
                    providerOAuthId: profile.id,
                    refresh_token: refreshToken,
                    access_token: accessToken,
                    expires_at: (slug.expires_in % (2 ** 32)) as number || 0,
                    token_type: slug.token_type,
                    scope: slug.scope,
                    id_token: slug.id_token,
                  }
                });
                done(null, linkedUser, { message: "OAuth login with Google successfully linked."});
              } else {
                done(null, false, { message: "User have logged in with another Google Account. Please login with that account instead." })
              }
            } else {
              done(null, false, { message: "User with this email already exists. Please login and link your oauth provider."})
            }
          }
        } else {
          const user = await prisma.user.findUniqueOrThrow({
            where: {
              id: authedUser.userId
            }
          });
          done(null, user, { message: "User logged in successfully" });
        }

      } catch (err) {
        console.error(err);
        done(err, false, { message: err as string });
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

  //Coinbase OAuth Create and Link OR Login Routine
  async (accessToken: any, refreshToken: any, profile: CoinbaseProfile, done: (error: any, user?: any, info?: any) => void) => {
    //Flow is roughly the same as Google, just that this provides created_at and does not provide expires_at
    try {
      const authedUser = await prisma.oAuthProfile.findUnique({
        where: {
          provider_providerOAuthId: {
            provider: "coinbase",
            providerOAuthId: profile._json.id
          }
        }
      });

      if (!authedUser) {

        const user = await prisma.user.findUnique({
          where: {
            email: profile._json.email
          }, 
          select: {
            authprofiles: true,
            canLink: true,
            id: true
          }
        });

        if (!user) { //create
          const user = await prisma.user.create({
            data: {
              name: profile._json.name,
              email: profile._json.email,
              image: profile._json.avatar_url
            }
          });
          const authprofile = await prisma.oAuthProfile.create({
            data: {
              userId: user.id,
              created_at: new Date(profile._json.created_at),
              type: "",
              provider: "coinbase",
              providerOAuthId: profile._json.id,
              refresh_token: refreshToken,
              access_token: accessToken,
              expires_at: (new Date(profile._json.created_at).getTime() + 24 * 3600 * 7) % (2 ** 32),
              token_type: "",
              scope: `wallet:user:email, wallet:user:read`
            }
          });

          done(null, user, { message: "User Created successfully"});

        } else { 
          if (user.canLink) {
            const linkedUser = await prisma.user.update({
              where: {
                id: user.id
              },
              data: {
                canLink: false
              }
            });

            const coinbaseProfileExists = user.authprofiles.filter(e => e.provider === "coinbase").length > 0;

            if (!coinbaseProfileExists) {
              const authprofile = await prisma.oAuthProfile.create({
                data: {
                  userId: user.id,
                  created_at: new Date(profile._json.created_at),
                  type: "",
                  provider: "coinbase",
                  providerOAuthId: profile._json.id,
                  refresh_token: refreshToken,
                  access_token: accessToken,
                  expires_at: (new Date(profile._json.created_at).getTime() + 24 * 3600 * 7) % (2 ** 32),
                  token_type: "",
                  scope: `wallet:user:email, wallet:user:read`
                }
              });
              done(null, linkedUser, { message: "OAuth login with Coinbase successfully linked."});
            } else {
              done(null, false, { message: "User has already logged in with another Coinbase Account. Please login with that account instead." })
            }
          } else {
            done(null, false, { message: `User with this email address already exists. Please login to link your oauth profile.`});
          }
        }
      } else {
        const user = await prisma.user.findUniqueOrThrow({
          where: {
            id: authedUser.userId
          }
        });
        done(null, user, { message: "User logged in successfully" });
      }

    } catch (err) { //Error Occurred
      done(err, false, { message: err as string});
    }
  })
);

//Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'email', passReqToCallback: true },

  //User Login Routine
  async (req, email: string, password: string, callback: (error: any, user?: any, options?: { message: string }) => void) => {
    try {
      //On server, interface directly with prisma -> TRPC not allowed
      const user = await prisma.user.findUnique({
        where: {
          email: email
        }
      });
      if (!user || !user.password) {
        // Prompt Signup via form
        callback(null, false, { message: "Please signup via our form" });
      } else {
        if (!await argon2.verify(user.password, password)) {
          callback(null, false, { message: "Password provided did not match"});
        } else {
          if (!user.verified) { //Only allow login requests for users whose emails have been verified.
            callback(null, false, { message: "Please verify your email address before logging in" })
          } else {
            callback(null, user, { message: "User logged in successfully"});
          }
        }
      }
    } catch (err) {
      //Error logging should be turned off in production
      callback(err, false, { message: err as string });
    }
  }
));

//Magic Link
export const magicLogin = new MagicLoginStrategy({
  secret: env.JWT_SECRET,

  callbackUrl: "/api/auth/signup/verify",

  sendMagicLink: async (destination, href) => {
    const data = JSON.parse(JSON.stringify(destination));

    await mailer.send("verify", {
      name: data.name,
      link: `${BASEURL}${href}`
    }, {
      to: data.email
    })
  },

  verify: async (payload, callback) => {
    try {
      const user = await prisma.user.update({
        where: {
          email: payload.destination.email
        },
        data: {
          emailVerified: new Date(Date.now()),
          verified: true
        }, 
        select: {
          name: true,
          id: true,
          image: true
        }
      });
      callback(null, user);
    } catch (err: any) {
      callback(err);
    }
  },
});

passport.use(magicLogin);

export default passport;