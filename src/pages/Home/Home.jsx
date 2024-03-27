import { useNavigate } from "react-router-dom"
import featured1 from "/icons8-download-100.png";
import featured2 from "/icons8-internship-80.png";
import featured3 from "/icons8-template-100.png";
import Carousel from "../../components/Home/Carousel";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserData } from '../../slices/userSlice';
import hero_img from "/Resume-amico.svg"
import "./home.css"
import { useEffect } from "react";


const Home = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated, userData } = useSelector((state) => state.authStatus);

    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUserData(userData))
    }, [dispatch, userData])

    // console.log(userData);
    // console.log(user);

    return (
        <>
            <div id="hero-section" className="w-full h-screen px-6 py-3">
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col-reverse lg:flex-row items-center justify-around w-full">
                        <article className="text-white flex flex-col items-start justify-center gap-y-6 h-full">
                            <h1 className="text-4xl font-extrabold">Lets Get You Hired</h1>
                            <p className="text-xl font-semibold">Create Professional Job Ready Resume In Minutes With StyleYourResume!</p>
                            {
                                userData ?
                                    <button className="hover:shadow-lg transition-transform duration-150 ease-linear bg-amber-500 px-12 py-4 rounded-full text-xl font-bold" onClick={() => navigate('/profile')}>View Profile</button>
                                    :
                                    <button className="hover:shadow-lg transition-transform duration-150 ease-linear bg-amber-500 px-12 py-4 rounded-full text-xl font-bold" onClick={() => navigate('/details')}>Create Now</button>
                            }
                        </article>
                        <img src={hero_img} className="hero-section-img w-[22rem] lg:w-[30rem]" width={500} alt="" />
                    </div>
                </div>
            </div>
            <div className="relative px-6 py-3 w-full min-h-screen flex items-center justify-evenly flex-col">
                <h1 className="text-3xl font-extrabold">3 Steps To Create Resume</h1>
                <ul className="promotional-list mt-12 flex items-center justify-center lg:justify-evenly flex-col lg:flex-row gap-y-6 gap-x-4 w-full">
                    <li className="flex items-center justify-center flex-col gap-y-4  px-4 py-6 hover:cursor-pointer w-[18rem] h-[20rem]">
                        <div className="list-after text-white px-4 py-6">
                            <h1 className="text-xl font-bold">Choose Your Template</h1>
                            <p className="text-sm py-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita ab numquam eveniet laboriosam esse nulla tempora vitae eos, similique soluta.</p>
                        </div>
                        <div className="w-44 h-44 md:w-36 md:h-36 rounded-full border-4 flex items-center justify-center">
                            <img src={featured3} alt="" />
                        </div>
                        <h3 className="text-xl font-bold">Choose Your Template</h3>
                    </li>
                    <li className="flex items-center justify-center flex-col gap-y-4  px-4 py-6 hover:cursor-pointer w-[18rem] h-[20rem]">
                        <div className="list-after text-white px-4 py-6">
                            <h1 className="text-xl font-bold">Choose Your Template</h1>
                            <p className="text-sm py-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita ab numquam eveniet laboriosam esse nulla tempora vitae eos, similique soluta.</p>
                        </div>
                        <div className="w-44 h-44 md:w-36 md:h-36 rounded-full border-4  flex items-center justify-center">
                            <img src={featured2} alt="" />
                        </div>
                        <h3 className="text-xl font-bold">Show What You Made Of</h3>
                    </li>
                    <li className="flex items-center justify-center flex-col gap-y-4 px-4 py-6 hover:cursor-pointer w-[18rem] h-[20rem]">
                        <div className="list-after text-white px-4 py-6">
                            <h1 className="text-xl font-bold">Choose Your Template</h1>
                            <p className="text-sm py-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita ab numquam eveniet laboriosam esse nulla tempora vitae eos, similique soluta.</p>
                        </div>
                        <div className="w-44 h-44 md:w-36 md:h-36 rounded-full border-4 flex items-center justify-center">
                            <img src={featured1} className="" alt="" />
                        </div>
                        <h3 className="text-xl font-bold">Download Resume</h3>
                    </li>
                </ul>
            </div>
            <div className="px-6 py-3 w-full min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl font-extrabold">Reviews From Our Clients</h1>
                <div className="w-full px-6 py-3 mt-12">
                    <Carousel />
                </div>
            </div>
        </>
    )
}

export default Home