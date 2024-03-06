import { SignUp as SignUpForm } from "../../components/Login/SignUp";
import Signup_Logo from "/login_page_pic.jpg";

const SignUp = () => {
    return (
        <div className="min-h-[80vh] mx-24 flex flex-col items-center justify-center">
            <div className="flex items-center justify-around w-full">
                <div className="relative">
                    <img src={Signup_Logo} className="" width={400} alt="" />
                    <h1 className="text-center text-3xl font-extrabold font-heading text-primary absolute top-36 z-10">Design Your Resume With One Click</h1>
                </div>
                <SignUpForm />
            </div>
        </div>
    )
}

export default SignUp