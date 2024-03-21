import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchUserData } from "../../slices/userSlice";
import { useReactToPrint } from 'react-to-print';
import Loader from "../../components/Loader/Loader";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Demo = () => {

    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.user);
    const { userData } = useSelector((state) => state.authStatus)

    const [filteredSkills, setFilterSkills] = useState({});

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        if (userData) {
            dispatch(fetchUserData(userData))
        }
    }, [dispatch, userData])

    useEffect(() => {
        const skills = {}
        user?.skillDetails.forEach((data) => {
            if (!(data.skillType in skills)) {
                skills[data.skillType] = [];
                skills[data.skillType].push(data.Skill);
            }
            else {
                skills[data.skillType].push(data.Skill);
            }
        })
        // console.log(skills);
        setFilterSkills(skills)
    }, [user])

    // const { personalDetails, educationalDetails, expirienceDetails, skillDetails, projectDetails } = user;


    return loading ?
        <Loader />
        :
        (
            <>
                <div className="flex items-center justify-center flex-col gap-y-4 bg-gray-100 md:py-16 overflow-hidden">
                    <div ref={componentRef} className=" w-[794px] rounded-lg bg-white">
                        <div className="flex rounded-t-lg sm:px-2 w-full">
                            <div className="my-4 flex items-center justify-center gap-y-2 flex-col text-center  w-full">
                                <p className="font-poppins font-bold text-heading sm:text-4xl text-2xl">
                                    {user?.personalDetails?.Name}
                                </p>
                                <p className="font-semibold text-base"><span>{user?.personalDetails?.PhoneNumber}</span> | <span><a href={`mailto:${user?.personalDetails?.Email}`}>{user?.personalDetails?.Email}</a></span> | <span className="underline"><a href={user?.personalDetails?.LinkedIn} target="_">Linkedin</a></span> | <span className="underline"><a href={user?.personalDetails?.Github} target="_">Github</a></span></p>
                            </div>
                        </div>
                        {/* main content */}
                        <div className="p-5">
                            <div className="">
                                <div className="px-4">
                                    <h1 className="text-xl font-bold">Education</h1>
                                    <div className="h-[1px] w-full bg-black my-2"></div>
                                    {
                                        user?.educationalDetails?.educationDetailsArray && user?.educationalDetails?.educationDetailsArray.map((data, i) => (

                                            < div key={i} className="flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-lg font-semibold">{data.Course}</h2>
                                                    <p className="text-sm">{data.InstituteName}</p>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{data.Year}</p>
                                                    <p>{data.Marks}%</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                                <div className="px-4">
                                    <h1 className="text-xl font-semibold mt-4">Experience</h1>
                                    <div className="h-[1px] w-full bg-black my-2"></div>
                                    {/** Section */}
                                    {
                                        user?.expirienceDetails?.experienceArray.map((data, i) => (

                                            <div key={i} className="">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h2 className="text-lg font-bold">{data.Profile}</h2>
                                                        <p className="text-lg font-semibold">{data.Company}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{data.From} - {data.To}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Description</p>
                                                    <p>{data.Responsibilities}</p>
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div>
                                <div className="px-4">
                                    <h1 className="text-xl font-bold mt-4">Projects</h1>
                                    <div className="h-[1px] w-full bg-black my-2"></div>
                                    {/** Section */}
                                    {
                                        user?.projectDetails?.projectsArray.map((data, i) => (

                                            <div key={i} className="">
                                                <div className="flex items-center justify-between">
                                                    <h2 className="text-lg font-semibold">{data.Project} | <a href={data.Link} target="_">Link</a></h2>
                                                    <div>
                                                        <p className="font-semibold">{data.Year}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Description</p>
                                                    <p>{data.Description}</p>
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div>
                                <div className="px-4">
                                    <h1 className="text-xl font-bold mt-4">Technical Skills</h1>
                                    <div className="h-[1px] w-full bg-black my-2"></div>
                                    {/** Section */}
                                    <ul className="list-disc list-inside flex flex-col items-start gap-x-4">
                                        {
                                            Object.entries(filteredSkills).map((skillType, index) => (
                                                <li key={index}>{skillType[0]}: {skillType[1]}</li>
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