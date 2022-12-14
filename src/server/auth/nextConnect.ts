import { NextApiRequest, NextApiResponse } from "next";

export const nextConnectOptions = {
  onError(err: any, req: NextApiRequest, res: NextApiResponse) {
    console.error(err);
    res.statusCode =
      err.status && err.status >= 100 && err.status < 600 ? err.status : 500;
    res.json({ message: err.message });
  },
};