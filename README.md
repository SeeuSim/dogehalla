# DogeTTM

---
Welcome to DogeTTM - Your next biggest asset in NFT value analysis :)
In order to test the app, follow the [Setup Instructions](#dev-environment-setup) as listed below.

## Dev Environment Setup

1. Run `npm install` after cloning the repository.
2. Configure the OAuth setup as described in the following sections:

- [Google Auth](#google-auth)
- [Coinbase Auth](#coinbase-auth)

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

### JWT Setup

1. Run the following command in your powershell/zsh/bash terminal:

```shell
openssl rand -base64 32
```

Proceed to copy the printed string into your .env file under `JWT_SECRET`. Save, and you're done!

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
