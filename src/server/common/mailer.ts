import { env } from "env/server.mjs";
import { SendMailOptions, Transport } from "nodemailer";
import { Mailer } from "nodemailer-react";
import { Options as TransportOptions, SentMessageInfo } from "nodemailer/lib/smtp-transport";
import { VerifyEmail } from "server/common/mail/verifyEmail";

const transport: TransportOptions | Transport = {
  port: env.EMAIL_PORT as unknown as number,
  host: env.EMAIL_HOST,
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD
  }
}

const defaults: SendMailOptions = {
  from: env.EMAIL_USER
}

export const mailer = Mailer(
  { transport, defaults }, 
  { verify: VerifyEmail }
);