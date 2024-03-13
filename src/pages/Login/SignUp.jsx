import { SignUp as SignUpForm } from "../../components/Login/SignUp";
import Signup_Logo from "/login__image.svg";

const SignUp = () => {
  return (
    <div className="w-full h-screen py-3 px-6 flex flex-col items-center justify-center">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-around w-full h-full">
        <div className="hidden h-full lg:flex items-center justify-center flex-col">
          <img src={Signup_Logo} className="object-contain w-[20rem]" width={500} alt="" />
          <h1 className="mt-6 text-center text-3xl font-extrabold font-heading text-primary">Design Your Resume With One Click</h1>
        </div>
        <SignUpForm />
      </div>
    </div>
  )
}

export default SignUp