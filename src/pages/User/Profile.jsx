import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { fetchUserData } from "../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import Loader from "../../components/Loader/Loader"
import useMakeURLShort from "../../hooks/useMakeURLShort";
import getResumeSuggestions from "../../appwrite/Suggestions";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { returnUserNameFromURL } = useMakeURLShort()

    const { user, loading, isUpdated } = useSelector((state) => state.user)
    const { userData } = useSelector((state) => state.authStatus);

    const [personalData, setPersonalData] = useState({});
    const [educationData, setEducationData] = useState([]);
    const [expirienceData, setExpirienceData] = useState([]);
    const [projecData, setProjectData] = useState([]);
    const [skills, setSkills] = useState([]);
    const [filteredSkills, setFilteredSkills] = useState([]);
    const [isContentEditable, setIsContentEditable] = useState(null);
    const [plainText, setPlainText] = useState("")

    useEffect(() => {
        if (userData) {
            // console.log("profile=> fetch data", userData);
            dispatch(fetchUserData(userData))
        }
    }, [dispatch, userData])

    useEffect(() => {
        if (user) {
            console.log(user);
            setPersonalData(user?.userData?.personalDetails ?? {})
            setEducationData(user?.userData?.educationalDetails ?? [])
            setExpirienceData(user?.userData?.expirienceDetails ?? [])
            setProjectData(user?.userData?.projectDetails ?? [])
            setSkills(user?.userData?.skillDetails ?? [])
        }
    }, [user])

    // const handleInput = (event) => {
    //     const newValue = event.target.innerText;
    //     // setEditedValue(newValue);
    //     // console.log(newValue);
    // };

    const handleEditable = (field) => {
        setIsContentEditable(field);
    }

    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setPersonalData({ ...personalData, [name]: value });
    // }

    useEffect(() => {
        let filteredSkills = {};
        skills.forEach((data) => {
            if (!(data.skillType in filteredSkills)) {
                filteredSkills[data.skillType] = [];
                filteredSkills[data.skillType].push(data.Skill)
            }
            else {
                filteredSkills[data.skillType].push(data.Skill)
            }
        })
        setFilteredSkills(filteredSkills);
        // console.log(filteredSkills);
    }, [skills])

    useEffect(() => {
        if (expirienceData) {
            let textData = "";
            expirienceData && expirienceData.forEach((data, index) => {
                textData += `Experience ${index + 1}:
                Position: ${data.Profile}
                Company: ${data.Company}
                Start Date: ${data.From}
                End Date: ${data.To}
                Responsibilities:
                ${data.Responsibilities.split('\n').map((point, i) => `${i + 1}. ${point}`)}`
            });
            setPlainText(textData)
        }
    }, [expirienceData])


    // const renderField = (field, data, setData) => {
    //     if (isContentEditable === field) {
    //         return (
    //             <div>
    //                 <input type="text" className="text-xl font-bold text-center" name={field} value={data} onChange={(e) => setData(e.target.value)} />
    //             </div>
    //         )
    //     }
    //     else {
    //         return (
    //             <h1 onDoubleClick={() => handleEditable(field)} className="text-xl font-bold" onInput={handleInput}>{data}</h1>
    //         )
    //     }
    // }

    return (
        loading ?
            <Loader />
            :
            <>
                <div className="w-full h-screen py-16">
                    <div className="flex items-center justify-center flex-col">
                        <div className="bg-gray-100">
                            <div className="container mx-auto py-8">
                                <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                                    <div className="col-span-4 sm:col-span-3">
                                        <div className="bg-white shadow rounded-lg p-6">
                                            <div className="flex flex-col items-center">
                                                <img src="https://randomuser.me/api/portraits/men/94.jpg" className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0" />
                                                <h1 className="text-xl font-bold">{personalData?.Name}</h1>
                                                <p className="text-gray-700">{personalData?.Designation}</p>
                                                <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={() => navigate('/edit')}>Edit Data</button>
                                                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded" onClick={() => navigate('/template1')}>Resume</button>
                                                </div>
                                            </div>
                                            <hr className="my-6 border-t border-gray-300" />
                                            <div className="flex flex-col">
                                                <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Links</span>
                                                <ul>
                                                    <li className="my-2 text-base hover:cursor-pointer">
                                                        <span className=" mr-1"><LinkedInIcon fontSize="medium" /></span>
                                                        <span className="text-blue-500">{personalData?.LinkedIn ? <a href={personalData?.LinkedIn} target="_">{returnUserNameFromURL(personalData?.LinkedIn)}</a> : "Add LinkedIn Link"}</span>
                                                    </li>
                                                    <li className="my-2 text-base hover:cursor-pointer">
                                                        <span className=" mr-1"><GitHubIcon fontSize="medium" /></span>
                                                        <span className="text-blue-500">{personalData?.Github ? <a href={personalData?.Github} target="_">{returnUserNameFromURL(personalData?.Github)}</a> : "Add Github Link"}</span>
                                                    </li>
                                                    <li className="my-2 text-base hover:cursor-pointer">
                                                        <span className=" mr-1"><EmailIcon fontSize="medium" /></span>
                                                        <span className="text-blue-500">{personalData?.Email ? personalData?.Email : "Add Email Account"}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="flex flex-col mt-6">
                                                <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Skills</span>
                                                <ul>
                                                    {
                                                        Object.entries(filteredSkills).map((data, i) => (
                                                            <li className="mb-2" key={i}>
                                                                <span className="font-semibold">{data[0]}: </span>
                                                                <span>{data[1].join(", ")}</span>
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-4 sm:col-span-9">
                                        <div className="bg-white shadow rounded-lg p-6">
                                            <h2 className="text-xl font-bold mb-4">Career Objective</h2>
                                            <p className="text-gray-700" id="careerObjective" onDoubleClick={() => handleEditable("careerObjective")}>{personalData?.CareerObjective}</p>

                                            <h2 className="text-xl font-bold mt-6 mb-4">Experience <span onClick={() => getResumeSuggestions("expirience", plainText)}>generate suggestions</span></h2>
                                            {
                                                expirienceData && expirienceData.map((data, i) => (
                                                    <div key={i} className="mb-6">
                                                        <div className="flex justify-between flex-wrap gap-2 w-full">
                                                            <p className="text-gray-700 font-bold" onDoubleClick={() => handleEditable("JobProfile")}>{data.Profile} | {data?.Company}</p>
                                                            <span className="text-gray-700">{data.From} - {data.To}</span>
                                                        </div>
                                                        <div className="mt-2">
                                                            <p className="font-semibold">Responsibilities</p>
                                                            <ul className="list-disc list-outside ml-6 md:w-[70%]">
                                                                {
                                                                    data.Responsibilities.split('\n').map((point, i) => (
                                                                        <li key={i}>{point}</li>

                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            <h2 className="text-xl font-bold mt-6 mb-4">Education</h2>
                                            {
                                                educationData && educationData.map((data, i) => (
                                                    <div key={i} className="mb-6">
                                                        <div className="flex justify-between flex-wrap gap-2 w-full">
                                                            <div>
                                                                <p className="text-gray-700 font-bold" onDoubleClick={() => handleEditable("JobProfile")}>{data.Course}</p>
                                                                <p className="text-gray-700 mr-2">{data?.InstituteName}</p>
                                                            </div>
                                                            <div className="text-gray-700">
                                                                <p className="font-bold">{data.Year}</p>
                                                                <p>{data.Marks}%</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            <h2 className="text-xl font-bold mt-6 mb-4">Projects</h2>
                                            {
                                                projecData && projecData.map((data, i) => (
                                                    <div key={i} className="mb-6">
                                                        <div className="flex justify-between gap-2 w-full">
                                                            <div>
                                                                <p className="text-gray-700 font-bold" > <span> {data.Project}</span> <span> <a href={data.Link} target="_"><OpenInNewIcon fontSize="medium" /></a></span></p>
                                                                <ul className="list-disc list-outside ml-6 md:w-[70%]">
                                                                    {
                                                                        data.Description.split('\n').map((point, i) => (
                                                                            <li key={i}>{point}</li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            </div>
                                                            <div className="text-gray-700">
                                                                <p className="font-bold">{data.Year}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </>
    )
}

export default Profile