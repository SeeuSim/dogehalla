import { useEffect, useRef, useState } from "react";
import { NextApiRequest, NextApiResponse } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { env } from "env/client.mjs";
import ReCAPTCHA from "react-google-recaptcha";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getSession } from "server/auth/session";

import { AlertInput } from "components/forms/alert";
import OAuthButton from "components/buttons/OAuthButton";
import { CogIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

/**
 * Form Styling
 */
const labelStyle = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
const fieldStyle = `
  bg-gray-100 
  border border-gray-300 
  text-gray-900 sm:text-sm 
  rounded-md
  focus:bg-gray-50 focus: border-gray-500
  block w-full p-2.5 
  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
  dark:focus:border-gray-500 dark:focus:bg-gray-600
  dark:text-white 
`;

/**
   * Form Validation
   */
const userSchema = z
  .object({
    firstName: z.string().max(36),
    lastName: z.string().min(1, { message: "The last name is required." }).max(36),
    email: z.string().email().min(1, {message: "Email address is required"}).max(36),
    password: z.string().min(8, {message: "Password must be at least 8 characters in length"})
      .max(60, {message: "Password can only be at most 60 characters in length"}),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, { 
    path: ["confirmPassword"],
    message: "The passwords do not match" 
  });

type FormData = z.infer<typeof userSchema>;

/**
 * Page Component
 */
export default function SignUp() {
  //Show Loading UI
  const [submitting, setSubmitting] = useState(false);

  //Hide Password element
  const [showPassword, setShowPassword] = useState(false);

  //Hide ConfirmPassword element
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const gCAPTCHARef = useRef<ReCAPTCHA>(null);

  const verifyCAPTCHA = async () => {
    const token = gCAPTCHARef.current?.getValue();
    const verify = await fetch(
      `../api/auth/verifyCaptcha`, {
        method: "POST",
        body: JSON.stringify({
          token
        })
      }
    );

    if (verify.ok) {
      return true;
    }

    console.log(verify.text());
    return false;
  }

  //React Form Hooks
  const {
    register, handleSubmit, formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
  });

  const router = useRouter();

  useEffect(() => {
    router.prefetch("/message/signupSuccess");
  }, [router]);

  //Submission Logic
  async function onSubmit (data: any) {
    const proceed = await verifyCAPTCHA();
    if (!proceed) {
      return;
    }

    setSubmitting(true);
    const res = await fetch(`../api/auth/signup`, {
      method: "POST",
      body: JSON.stringify(data)
    });
    setSubmitting(false);
    if (res.ok) {
      //Prevent Back navigation
      return router.replace("/message/signupSuccess");
    } 
    //Toast the message
    const rs = await res.text();
    console.log(rs); //<<Replace this with toasts.
  };

  const handlePassword = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  
  const handleConfirmPassword = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex flex-col items-center mx-auto md:h-full lg:py-0 bg-inherit">
      <Head>
        <title>Sign Up | NFinsighT</title>
      </Head>

      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="space-y-4 p-4 sm:p-6">
          {/** Sign Up Header */}
          <div>
            <h2 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-200">
              Get Started
            </h2>
            <p className="text-gray-900 dark:text-gray-200 mt-1">Create a new account</p>
          </div>

          {/** OAuth Providers */}
          <OAuthButton logoImg="https://freesvg.org/img/1534129544.png" provider="google" providerName="Google" copytext="Continue"/>
          <OAuthButton logoImg="https://avatars.githubusercontent.com/u/18060234?s=280&v=4" provider="coinbase" providerName="Coinbase" copytext="Continue"/>
          
          {/** Separator */}
          <div className="flex items-center justify-between">
            <hr className="mx-auto w-36 h-0.5 bg-gray-100 rounded border-0 dark:bg-gray-700"/>
            <div className="dark:text-gray-400 font-medium">or</div>
            <hr className="mx-auto w-36 h-0.5 bg-gray-100 rounded border-0 dark:bg-gray-700"/>
          </div>

          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="columns-2 inline-flex space-x-4">
              <div>
                <label htmlFor="firstName" className={labelStyle}>First Name:</label>
                <input type="text" 
                      id="firstName"
                      className={fieldStyle}
                      placeholder="John"
                      {...register("firstName")}
                      aria-invalid={errors.firstName ? "true" : "false"}
                      />
                <AlertInput>{errors?.firstName?.message}</AlertInput>
              </div>

              <div className="relative">
                <label htmlFor="lastName" className={labelStyle}>Last Name:</label>
                <input type="text" 
                      id="lastName" 
                      className={fieldStyle}
                      placeholder="Smith"
                      // required={true}
                      {...register("lastName")}/>
                <AlertInput>{errors?.lastName?.message}</AlertInput>
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelStyle}>Email Address:</label>
              <input type="email" 
                    id="email"
                    className={fieldStyle}
                    placeholder="johnSmith@acme.com"
                    autoComplete="email"
                    // required={true}
                    {...register("email")}/>
              <AlertInput>{errors?.email?.message}</AlertInput>
            </div>

            <div className="relative">
              <label htmlFor="password" className={labelStyle}>Password:</label>
              <input type={showPassword? "text": "password"} 
                    id="password"
                    className={fieldStyle + `
                      pr-8
                    `}
                    // required={true}
                    placeholder="••••••••" 
                    {...register("password")}/>
              <AlertInput>{errors?.password?.message}</AlertInput>
              <button className={`absolute -translate-y-8 right-2`}
                      onClick={handlePassword}>
                {showPassword
                  ? <EyeSlashIcon className="h-5 w-5 text-gray-900 dark:text-gray-200 hover:text-gray-800 hover:dark:text-gray-300"/>
                  : <EyeIcon className="h-5 w-5 text-gray-900 dark:text-gray-200 hover:text-gray-800 hover:dark:text-gray-300"/>}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className={labelStyle}>Confirm Password:</label>
              <input type={showConfirmPassword? "text": "password"} 
                    id="password"
                    className={fieldStyle + `
                      pr-8
                    `}
                    // required={true}
                    placeholder="••••••••" 
                    {...register("confirmPassword")}/>
              <AlertInput>{errors?.confirmPassword?.message}</AlertInput>
              <button className={`absolute -translate-y-8 right-2`}
                      onClick={handleConfirmPassword}>
                {showConfirmPassword
                  ? <EyeSlashIcon className="h-5 w-5 text-gray-900 dark:text-gray-200 hover:text-gray-800 hover:dark:text-gray-300"/>
                  : <EyeIcon className="h-5 w-5 text-gray-900 dark:text-gray-200 hover:text-gray-800 hover:dark:text-gray-300"/>}
              </button>
            </div>

            <div className="relative flex items-center justify-center py-2">
                <label htmlFor="recaptcha" className="sr-only">Recaptcha</label>
                <ReCAPTCHA
                  className="flex object-cover"
                  sitekey={env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                  ref={gCAPTCHARef}
                  
                />
              </div>
            
            {/* Loading UI | Errors UI | Normal UI */}
            { submitting
              ? <button
                  disabled={true}
                  className={`
                    inline-flex items-center justify-center
                    w-full space-x-2
                    font-medium rounded-lg 
                    text-sm px-5 py-2.5 text-center
                    bg-slate-300 dark:bg-slate-800
                    hover:bg-slate-500 dark:hover:bg-slate-600
                    text-slate-900 dark:text-slate-200 
                  `}
                >
                  <CogIcon className="h-6 w-6 animate-spin"/>
                  <p>Loading</p>
                </button>

              : Boolean(Object.keys(errors)?.length)
              ? <button type="submit"
                        disabled={true}
                        className={`
                          flex items-center justify-center
                          w-full translate-y-2
                          text-white 
                          bg-red-500
                          focus:ring-4 focus:outline-none 
                          focus:ring-red-300 
                          font-medium rounded-lg 
                          text-sm px-5 py-2.5 text-center 
                          dark:focus:ring-red-800
                        `}>Correct the errors in the form</button>
            
              : <button type="submit"
                        className={`
                          flex items-center justify-center
                          w-full 
                          text-white 
                          bg-blue-600 hover:bg-blue-700 
                          focus:ring-4 focus:outline-none 
                          focus:ring-blue-300 
                          font-medium rounded-lg 
                          text-sm px-5 py-2.5 text-center 
                          dark:focus:ring-blue-800
                        `}>Register Your Account</button>
            }
            
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                Log in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );

}

export async function getServerSideProps ({req, res}: {req: NextApiRequest, res: NextApiResponse}) {
  const session = await getSession(req, res);
  const user = session?.passport?.user;
  if (!user) {
    return { props: {} }
  }
  return { redirect: { destination: "/", permanent: true } };
}