# **DogeTTM**

Welcome to DogeTTM - Your next biggest asset in NFT value analysis :)
In order to test the app, follow the [Setup Instructions](#dev-environment-setup) as listed below.

## **Dev Environment Setup**

### **Prerequisites**

- [Docker](https://docs.docker.com/get-docker/)
- [`docker-compose`](https://docs.docker.com/get-started/08_using_compose/)
- [`pnpm`](https://pnpm.io/installation) or [`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (`npm` can be used, but all `pnpm` scripts in `package.json` will need to be altered)

1. Run `npm install` after cloning the repository.
2. Configure the OAuth setup as described in the following sections:
  - [Google Auth](#google-auth)
  - [Coinbase Auth](#coinbase-auth)
  - [Database Setup]()

3. Configure the JWT (JSON Web Token) setup in the section [JWT Setup](#jwt-setup).
4. Once done, open the application by running `npm run dev` in the terminal in the project root directory.

### **Google Auth**

First, prep the `.env` file by renaming `./.env.example` to `.env`.

1. Visit [Google Cloud OAuth Site](https://console.cloud.google.com/apis/credentials?authuser=1&project=dogettm-370912&supportedpurview=project) to obtain
the required credentials for the dev server.
2. Configure the credentials for "OAuth Client ID":

- **Application Type**: `Web Application`
- **Javascript origin**: `http://localhost:3000`
- **Redirect URI**: `http://localhost:3000/api/auth/callback/google`

3. Copy and paste the client id and client secret into your `.env` file in the root directory.

### **Coinbase Auth**

1. In your Coinbase Account, visit the [Coinbase API Site](http://www.coinbase.com/settings/api) to obtain the required credentials for the dev server. It can be configured under "Create new OAuth Application".
2. Configure the redirect URI as `http://localhost:3000/api/auth/callback/coinbase`
3. Copy and paste the client ID and client Secret into your `.env` file in the root directory.

### **Database Setup**

You only need this section if you are not using Docker and have your own Docker and Redis instance on your system.

1. Using `psql` or your system PostgreSQL client, setup a database instance and configure the `DATABASE_URL` in the `.env` as per the format given.
2. Start your own Redis server and paste the URL in `src/server/db/connectRedis.ts` under `redisUrl`.
3. Run `pnpm db:migrate && pnpm db:push` to migrate your database. If using `npm`, replace `pnpm` with `npm run`.

### **JWT Setup**

1. Run the following command in your powershell/zsh/bash terminal:

```shell
openssl rand -base64 32
```

Proceed to copy the printed string into your .env file under `JWT_SECRET`. Save, and you're done!

---

## Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

### What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

### Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

### How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
