import { NextPage } from "next";
import Head from "next/head";

const SignupSuccess: NextPage = () => {
  return (
    <>
      <Head>
        <title>Signup Successful | DogeTTM</title>
      </Head>
      <div>
        <p className="text-gray-800 dark:text-slate-200">
          Congratulations! Click on the link in your provided email address to complete your account activation. <br/> 
          If you did not receive it, please fill out this form so that we may send it again.
        </p>
      </div>
    </>
  );
}

export default SignupSuccess;