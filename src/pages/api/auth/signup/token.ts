import nextConnect from "next-connect";

import { magicLogin } from "server/auth/passport";
import { authOptions } from "server/auth/session";
import { nextConnectOptions } from "server/auth/nextConnect";

const handler = nextConnect(nextConnectOptions);

handler.use(...authOptions);

handler.post(magicLogin.send);

export default handler;