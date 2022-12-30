import { Session } from "server/trpc/context";

export type SessionProps = Session["passport"]["user"] | boolean | undefined;