import { Login as LoginForm } from "../../components/Login/Login";
import Signup_Logo from "/undraw_online_cv_re_gn0a.svg";
// import background from "/layered-waves-haikei.svg"
import "./login.css";

const Login = () => {
  return (
    <>
      <div className="from-primary to-color1 bg-gradient-to-b w-full h-screen py-3 px-6 flex flex-col items-center justify-center">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-around w-full">
          <div className="hidden lg:block">
            <img src={Signup_Logo} className="object-contain w-[20rem]" width={500} alt="" />
            <h1 className="text-center text-3xl font-extrabold font-heading text-primary ">Design Your Resume With One Click</h1>
          </div>
          <LoginForm />
        </div>
      </div>
      {/* <img src={background} className="w-full absolute -top-12" alt="" /> */}
    </>
  )
}

export default Login