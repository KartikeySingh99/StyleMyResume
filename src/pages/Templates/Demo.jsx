import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchUserData } from "../../slices/userSlice";
import { useReactToPrint } from 'react-to-print';
import Loader from "../../components/Loader/Loader";
import useMakeURLShort from "../../hooks/useMakeURLShort";
import FormatBar from "../../components/Template/FormatBar";


const Demo = () => {

    const dispatch = useDispatch();

    const { returnUserNameFromURL } = useMakeURLShort()

    const { user, loading } = useSelector((state) => state.user);
    const { userData } = useSelector((state) => state.authStatus)

    const [filteredSkills, setFilterSkills] = useState({});
    const [fontStyle, setFontStyle] = useState("font-sans")
    const [margin, setMargin] = useState("p-5");

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // useEffect(() => {
    //     componentRef.current.style.fontFamily = fontStyle;
    // }, [fontStyle])



    useEffect(() => {
        if (userData) {
            dispatch(fetchUserData(userData))
        }
    }, [dispatch, userData])

    useEffect(() => {
        const skills = {}
        if (Object.entries(user).length > 0) {

            user && user?.userData?.skillDetails.forEach((data) => {
                if (!(data.skillType in skills)) {
                    skills[data.skillType] = []; //* here we are declaring the keys with empty array
                    skills[data.skillType].push(data.Skill);
                }
                else {
                    skills[data.skillType].push(data.Skill);
                }
            })
            setFilterSkills(skills)
        }
    }, [user])

    console.log(user);
    const handleSelectText = () => {
        let text = window.getSelection().toString();
        // if(text){

        // }
    }

    // const { personalDetails, educationalDetails, expirienceDetails, skillDetails, projectDetails } = user;

    return loading ?
        <Loader />
        :
        (
            <>
                <div className="flex items-center justify-center flex-col gap-y-4 bg-gray-100 py-16">
                    <FormatBar setFontStyle={setFontStyle} fontStyle={fontStyle} margin={margin} setMargin={setMargin} printButton={handlePrint} />
                    <div className="w-fit rounded-lg ">
                        <div ref={componentRef} className={`${fontStyle} lg:w-[794px] lg:h-[1123px]  bg-white ${margin}`}>
                            <div className="flex rounded-t-lg sm:px-2 w-full">
                                <div className="mt-4 mb-2 flex items-center justify-center gap-y-2 flex-col text-center  w-full">
                                    <p className="font-bold text-heading sm:text-3xl text-2xl uppercase" onMouseUp={handleSelectText}>
                                        {user?.userData?.personalDetails?.Name}
                                    </p>
                                    <p className="font-semibold text-sm"><span>{user?.userData?.personalDetails?.PhoneNumber}</span> | <span><a href={`mailto:${user?.userData?.personalDetails?.Email}`}>{user?.userData?.personalDetails?.Email}</a></span> {user?.userData?.personalDetails?.LinkedIn && <span>|&nbsp;<a href={user?.userData?.personalDetails?.LinkedIn} target="_">{returnUserNameFromURL(user?.userData?.personalDetails?.LinkedIn)}</a></span>} {user?.userData?.personalDetails?.Github && <span>|&nbsp;<a href={user?.userData?.personalDetails?.Github} target="_">{returnUserNameFromURL(user?.userData?.personalDetails?.Github)}</a></span>}</p>
                                </div>
                            </div>
                            {/* main content */}
                            <div className="">
                                <div className="">
                                    <div className="px-4">
                                        <h1 className="sm:text-lg text-base font-bold uppercase">Education</h1>
                                        <div className="h-[1px] w-full bg-black mb-2"></div>
                                        {
                                            user?.userData?.educationalDetails && user?.userData?.educationalDetails.map((data, i) => (

                                                < div key={i} className="flex items-center justify-between my-1">
                                                    <div className="sm:text-base text-sm">
                                                        <h2 className="font-semibold">{data.Course}</h2>
                                                        <p>{data.InstituteName}</p>
                                                    </div>
                                                    <div className="sm:text-base text-sm ">
                                                        <p className="font-semibold">{data.Year}</p>
                                                        <p>{data.Marks}%</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {
                                        user?.userData?.expirienceDetails &&
                                        <div className="px-4">
                                            <h1 className="sm:text-lg text-base font-bold mt-2 uppercase">Experience</h1>
                                            <div className="h-[1px] w-full bg-black mb-2"></div>
                                            {/** Section */}
                                            {
                                                user?.userData?.expirienceDetails.map((data, i) => (

                                                    <div key={i} className="my-2">
                                                        <div className="flex items-start justify-between">
                                                            <div className="sm:text-base text-sm font-bold">
                                                                <h2 className="sm:text-base text-sm font-bold"><span>{data.Profile}</span>&nbsp;|&nbsp;<span>{data.Company}</span></h2>
                                                            </div>
                                                            <div className="sm:text-base text-sm">
                                                                <p className="font-semibold">{data.From} - {data.To}</p>
                                                            </div>
                                                        </div>
                                                        <div className="sm:text-base text-sm">
                                                            <p className="font-semibold">Responsibilities</p>
                                                            <ul className="list-disc list-outside ml-5">

                                                                {
                                                                    data.Responsibilities.split('\n').map((res, i) => (
                                                                        <li key={i}>{res}</li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))
                                            }

                                        </div>
                                    }
                                    {
                                        user?.userData?.projectDetails &&
                                        <div className="px-4">
                                            <h1 className="sm:text-lg text-base font-bold mt-2 uppercase">Projects</h1>
                                            <div className="h-[1px] w-full bg-black mb-2"></div>
                                            {/** Section */}
                                            {
                                                user?.userData?.projectDetails.map((data, i) => (

                                                    <div key={i} className="my-2">
                                                        <div className="flex items-center justify-between">
                                                            <h2 className="sm:text-base text-sm font-semibold">{data.Project} | <a href={data.Link} target="_">Link</a></h2>
                                                            <div>
                                                                <p className="sm:text-base text-sm font-semibold">{data.Year}</p>
                                                            </div>
                                                        </div>
                                                        <div className="sm:text-base text-sm">
                                                            <ul className="list-disc list-outside ml-5">
                                                                {
                                                                    data.Description.split('\n').map((item, i) => (
                                                                        <li key={i}>{item}</li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))
                                            }

                                        </div>
                                    }
                                    {
                                        user?.userData?.skillDetails &&
                                        <div className="px-4">
                                            <h1 className="sm:text-lg text-base font-bold mt-2 uppercase">Skills</h1>
                                            <div className="h-[1px] w-full bg-black mb-2"></div>
                                            {/** Section */}
                                            <ul className="list-disc list-inside flex flex-col items-start gap-x-4">
                                                {
                                                    Object.entries(filteredSkills).map((skill, index) => (
                                                        <li key={index} className="sm:text-base text-sm">
                                                            <span className="font-bold">{skill[0]}:&nbsp;</span>
                                                            <span>{skill[1].join(", ")}</span>
                                                        </li>
                                                    ))
                                                }
                                            </ul>

                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div >
            </>
        )
}

export default Demo