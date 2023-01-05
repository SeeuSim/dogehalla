// Fix for windows, should be reverted for production
export const BASEURL = `http://${process.env.NODE_ENV === "production" 
                                  ? process.env.VERCEL_URL 
                                  : "localhost:3000"}`; 
                                  //: `localhost:${process.env.PORT != undefined ? process.env.PORT : "3000"}`}`;
