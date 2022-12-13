# DogeTTM

Welcome to DogeTTM - Your next biggest asset in NFT value analysis :)
In order to test the app, follow the [Setup Instructions](#dev-environment-setup) as listed below.

## Dev Environment Setup

1. Run `npm install` after cloning the repository.
2. Configure the OAuth setup as described in the following sections:

- [Google Auth](#google-auth)
- [Coinbase Auth](#coinbase-auth)
- [Database Setup]()

3. Configure the JWT (JSON Web Token) setup in the section [JWT Setup](#jwt-setup).
4. Once done, open the application by running `npm run dev` in the terminal in the project root directory.

### Google Auth

First, prep the `.env` file by renaming `./.env.example` to `.env`.

1. Visit [Google Cloud OAuth Site](https://console.cloud.google.com/apis/credentials?authuser=1&project=dogettm-370912&supportedpurview=project) to obtain
the required credentials for the dev server.
2. Configure the credentials for "OAuth Client ID":

- **Application Type**: `Web Application`
- **Javascript origin**: `http://localhost:3000`
- **Redirect URI**: `http://localhost:3000/api/auth/callback/google`

3. Copy and paste the client id and client secret into your `.env` file in the root directory.

### Coinbase Auth

1. In your Coinbase Account, visit the [Coinbase API Site](http://www.coinbase.com/settings/api) to obtain the required credentials for the dev server. It can be configured under "Create new OAuth Application".
2. Configure the redirect URI as `http://localhost:3000/api/auth/callback/coinbase`
3. Copy and paste the client ID and client Secret into your `.env` file in the root directory.

### Database Setup

1. Using `psql` or your system PostgreSQL client, setup a database instance and configure the `DATABASE_URL` in the `.env` as per the format given.
2. Run `npx prisma migrate dev` to migrate your database.

### JWT Setup

1. Run the following command in your powershell/zsh/bash terminal:

```shell
openssl rand -base64 32
```

Proceed to copy the printed string into your .env file under `JWT_SECRET`. Save, and you're done!

## **Navigating Around**

---

In case you are lost, here's a guide to the respective folders in the project and how to navigate around them.

```shell
.
├─ app ##############-------- Main frontend components of the app - See nextJS documentation
│  └─ ...
├─ prisma ############------- Prisma Configuration
│  └─ schema.prisma
├─ env ##############-------- Validation Guards for `.env` variables
│  ├─ client.mjs
│  ├─ schema.mjs
│  └─ server.mjs
├─ pages ############-------- API Routing
│  ├─ api
│  │  ├─ auth 
│  │  │  └─ [...nextauth].ts
│  │  ├─ trpc
│  │  │  └─ [trpc].ts
│  │  └─ examples.ts
├─ types ############-------- Type Guards for Module Imports
│  └─ next-auth.d.ts
├─ utils ############-------- TRPC Config for the whole App
│  └─ trpc.ts
├─ server ###########-------- Backend Functions
│  ├─ common ########-------- Auth Session Validation for server
│  │  └─ get-server-auth-session.ts
│  ├─ db ############-------- Prisma Instance (DB)
│  │  └─ client.ts
│  └─ trpc
│     ├─ router #####-------- API Routes
│     │  ├─ _app.ts
│     │  ├─ auth.ts
│     │  └─ example.ts
│     ├─ context.ts #-------- Context handler for browser to manage sessions
│     └─ trpc.ts ####-------- Middleware
...

```

### **Key Pointers**

- `pages/api` vs `server/trpc/router`:
  
  The former is reserved for authentication calls, while the latter can be used to determine custom type-safe API routes that retrieve data directly from the server with TypeScript validation (`TRPC`) and input validation (`zod`).
- Migrations and seeding data
  
  As PostgreSQL is a relational database that stores data in tables, migrations are needed to enforce the schema on the database and "migrate" its structure. Also, you may wish to define functions that seed the data from scratch, for a fresh environment setup
- Schema (`./prisma/*`)

  This is where the table configurations for the Postgres Database is made. To add new tables, simply add new `model`s, while to add new columns to existing tables, add `field`s to those models. Remember to migrate the database once done.

## **Final Words**

We're still new to the Prisma/TRPC workflow, but we do believe it will help abstract away complexity in the long run and speed up development from here on. Do have patience with us as we iron out the bugs.

*Cheers*,

The DogeTTM Team

---

## Base Stuff from Vercel

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
