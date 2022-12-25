import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import OAuthButton from "../../components/buttons/OAuthButton";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

/**
 * Alert Functionality
 */
type AlertType = "error" | "warning" | "success"

// Global Alert div.
function Alert({ children, type }: { children: string; type: AlertType }) {
  const backgroundColor = type === "error" ? "bg-rose-400" : type === "warning" ? "bg-orange-400" : "bg-sky-400"

  return <div className={`px-3 ${backgroundColor}`}>{children}</div>
}

// Use role="alert" to announce the error message.
const AlertInput = ({ children }: {children: string | undefined}) =>
  Boolean(children) ? (
    <span className="bg-rose-400" role="alert">
      {children}
    </span>
  ) : null;

/**
 * Form Styling
 */
const labelStyle = "block mb-2 text-sm font-medium text-gray-900 dark:text-white";
const fieldStyle = `
  bg-gray-50 
  border border-gray-300 
  text-gray-900 sm:text-sm 
  rounded-lg 
  focus:ring-blue-600 focus:border-blue-600 
  block w-full p-2.5 
  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
`;

/**
 * Form Validation
 */
const userSchema = z
  .object({
    firstName: z.string().max(36),
    lastName: z.string().min(1, { message: "The last name is required." }).max(36),
    email: z.string().min(1, {message: "Email address is required"}).max(36),
    password: z.string().min(8, {message: "Password must be at least 8 characters in length"}).max(60),
  });

type FormData = z.infer<typeof userSchema>;

const onSubmit = (data: any) => {
  console.log(data);
};

/**
 * Page Component
 */
export default function SignUp() {
  //Hide Password element
  const [showPassword, setShowPassword] = useState(false);

  const {
    register, handleSubmit, formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(userSchema)
  });

  return (
    <div className="flex flex-col items-center px-6 mx-auto md:h-screen lg:py-0 bg-inherit">
      {Boolean(Object.keys(errors)?.length) && (
        <Alert type="error">There are errors in the form.</Alert>
      )}

      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="space-y-4 p-6 md:space-y-6 sm:p-8">
          {/** Sign Up Header */}
          <div>
            <h2 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-200">
              Get Started
            </h2>
            <p className="text-gray-900 dark:text-gray-200">Create a new account</p>
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
            <div className="columns-2">
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

            <div>
              <label htmlFor="lastName" className={labelStyle}>Last Name:</label>
              <input type="text" 
                    id="lastName" 
                    className={fieldStyle}
                    placeholder="Smith"
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
                    {...register("password")}/>
              <AlertInput>{errors?.password?.message}</AlertInput>
              <button className="absolute -translate-y-8 right-2"
                      onClick={() => setShowPassword(!showPassword)}>
                {showPassword
                  ? <EyeSlashIcon className="h-5 w-5 text-gray-900 dark:text-gray-200 hover:text-gray-800 hover:dark:text-gray-300"/>
                  : <EyeIcon className="h-5 w-5 text-gray-900 dark:text-gray-200 hover:text-gray-800 hover:dark:text-gray-300"/>}
              </button>
            </div>

            <button type="submit"
                    className={`
                      flex items-center justify-center
                      w-full 
                      text-white 
                      bg-blue-600 hover:bg-blue-700 
                      focus:ring-4 focus:outline-none 
                      focus:ring-blue-300 
                      font-medium rounded-lg 
                      text-sm px-5 py-2.5 text-center 
                      dark:bg-blue-600 dark:hover:bg-blue-700 
                      dark:focus:ring-blue-800
                    `}>Register Your Account</button> 
          </form>
        </div>
      </div>
    </div>
  );

}