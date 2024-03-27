import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchUserData } from "../../slices/userSlice";
import { useReactToPrint } from 'react-to-print';
import Loader from "../../components/Loader/Loader";
import useMakeURLShort from "../../hooks/useMakeURLShort";

const Demo = () => {

    const dispatch = useDispatch();

    const { returnUserNameFromURL } = useMakeURLShort()

    const { user, loading } = useSelector((state) => state.user);
    const { userData } = useSelector((state) => state.authStatus)

    const [filteredSkills, setFilterSkills] = useState({});

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    useEffect(() => {
        if (userData) {
            console.log(userData);
            dispatch(fetchUserData(userData))
        }
    }, [dispatch, userData])

    useEffect(() => {
        const skills = {}
        user && user?.skillDetails.forEach((data) => {
            if (!(data.skillType in skills)) {
                skills[data.skillType] = []; //* here we are declaring the keys with empty array
                skills[data.skillType].push(data.Skill);
            }
            else {
                skills[data.skillType].push(data.Skill);
            }
        })
        setFilterSkills(skills)
    }, [user])


    // const { personalDetails, educationalDetails, expirienceDetails, skillDetails, projectDetails } = user;


    return loading ?
        <Loader />
        :
        (
            <>
                <div className="flex items-center justify-center flex-col gap-y-4 bg-gray-100 py-16">
                    <div ref={componentRef} className="lg:w-[794px]  rounded-lg bg-white">
                        <div className="flex rounded-t-lg sm:px-2 w-full">
                            <div className="mt-4 flex items-center justify-center gap-y-2 flex-col text-center  w-full">
                                <p className="font-poppins font-bold text-heading sm:text-3xl text-2xl uppercase">
                                    {user?.personalDetails?.Name}
                                </p>
                                <p className="font-semibold sm:text-base text-sm"><span>{user?.personalDetails?.PhoneNumber}</span> | <span><a href={`mailto:${user?.personalDetails?.Email}`}>{user?.personalDetails?.Email}</a></span> {user?.personalDetails?.LinkedIn && <span>|&nbsp;<a href={user?.personalDetails?.LinkedIn} target="_">{returnUserNameFromURL(user?.personalDetails?.LinkedIn)}</a></span>} {user?.personalDetails?.Github && <span>|&nbsp;<a href={user?.personalDetails?.Github} target="_">{returnUserNameFromURL(user?.personalDetails?.Github)}</a></span>}</p>
                            </div>
                        </div>
                        {/* main content */}
                        <div className="p-5">
                            <div className="">
                                <div className="px-4">
                                    <h1 className="sm:text-lg text-base font-bold uppercase">Education</h1>
                                    <div className="h-[1px] w-full bg-black my-2"></div>
                                    {
                                        user?.educationalDetails?.educationDetailsArray && user?.educationalDetails?.educationDetailsArray.map((data, i) => (

                                            < div key={i} className="flex items-center justify-between my-1">
                                                <div className="sm:text-base text-sm">
                                                    <h2 className="  font-semibold">{data.Course}</h2>
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
                                <div className="px-4">
                                    <h1 className="sm:text-lg text-base font-bold mt-2 uppercase">Experience</h1>
                                    <div className="h-[1px] w-full bg-black my-2"></div>
                                    {/** Section */}
                                    {
                                        user?.expirienceDetails?.experienceArray.map((data, i) => (

                                            <div key={i} className="my-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="sm:text-base text-sm font-bold">
                                                        <h2 className="sm:text-base text-sm font-bold">{data.Profile}</h2>
                                                        <p className="font-semibold">{data.Company}</p>
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
                                <div className="px-4">
                                    <h1 className="sm:text-lg text-base font-bold mt-2 uppercase">Projects</h1>
                                    <div className="h-[1px] w-full bg-black my-2"></div>
                                    {/** Section */}
                                    {
                                        user?.projectDetails?.projectsArray.map((data, i) => (

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
                                <div className="px-4">
                                    <h1 className="sm:text-lg text-base font-bold mt-2 uppercase">Skills</h1>
                                    <div className="h-[1px] w-full bg-black my-2"></div>
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
                            </div>
                        </div>
                    </div>
                    <button className="w-fit bg-primary px-6 py-2 text-white rounded-sm" onClick={handlePrint}>Print</button>

                </div >
            </>
        )
}

export default Demo