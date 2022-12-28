

export const BASEURL = `http://${process.env.NODE_ENV === "production" 
                                  ? process.env.VERCEL_URL 
                                  : `localhost:${process.env.PORT != undefined ? process.env.PORT : "3000"}`}`;
