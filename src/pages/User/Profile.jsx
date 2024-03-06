import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { fetchUserData } from "../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import EditField from "../../components/User/EditField";

const Profile = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();

    const { user, loading, isUpdated } = useSelector((state) => state.user)
    const { userData } = useSelector((state) => state.authStatus);


    const [personalData, setPersonalData] = useState({});
    const [educationData, setEducationData] = useState([]);
    const [expirienceData, setExpirienceData] = useState([]);
    const [projecData, setProjectData] = useState([]);
    const [skills, setSkills] = useState([]);
    const [isContentEditable, setIsContentEditable] = useState(null);

    useEffect(() => {
        if (userData) {
            dispatch(fetchUserData(userData?.$id))
        }
    }, [dispatch, userData])


    useEffect(() => {
        if (user) {
            setPersonalData(user?.personalDetails ?? {})
            setEducationData(user?.educationalDetails?.educationDetailsArray ?? [])
            setExpirienceData(user?.expirienceDetails?.experienceArray ?? [])
            setProjectData(user?.projectDetails?.projectsArray ?? [])
            setSkills(user?.skillDetails ?? [])
        }
    }, [user])

    const handleInput = (event) => {
        const newValue = event.target.innerText;
        // setEditedValue(newValue);
        console.log(newValue);
    };

    const handleEditable = (field) => {
        setIsContentEditable(field);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPersonalData({ ...personalData, [name]: value });
    }

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
        <>
            <div className="w-full h-screen py-16">
                <div className="flex items-center justify-center flex-col border px-6 py-3">
                    <div className="bg-gray-100">
                        <div className="container mx-auto py-8">
                            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                                <div className="col-span-4 sm:col-span-3">
                                    <div className="bg-white shadow rounded-lg p-6">
                                        <div className="flex flex-col items-center">
                                            <img src="https://randomuser.me/api/portraits/men/94.jpg" className="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0" />
                                            {/* <EditField edit={isContentEditable} field={"Name"} setData={setPersonalData} /> */}
                                            <h1 className="text-xl font-bold" onInput={handleInput}>{personalData?.Name}</h1>
                                            {/* {renderField('Name', personalData.Name, setPersonalData)}
                                            <span onClick={() => setIsContentEditable("Name")}><EditIcon /></span>
                                            {renderField('Designation', personalData.Designation, setPersonalData)} */}
                                            <p className="text-gray-700">{personalData?.Designation}</p>
                                            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={()=>navigate('/edit')}>Edit Data</button>
                                                <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded">Resume</button>
                                            </div>
                                        </div>
                                        <hr className="my-6 border-t border-gray-300" />
                                        <div className="flex flex-col">
                                            <span className="text-gray-700 uppercase font-bold tracking-wider mb-2">Skills</span>
                                            <ul>
                                                {
                                                    skills.map((data, i) => (
                                                        <li className="mb-2" key={i}>{data?.Skill}</li>
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
                                        {/* {renderField("careerObjective", personalData?.CareerObjective, setPersonalData)} */}

                                        <h2 className="text-xl font-bold mt-6 mb-4">Experience</h2>
                                        {
                                            expirienceData && expirienceData.map((data, i) => (
                                                <div key={i} className="mb-6">
                                                    <div className="flex justify-between flex-wrap gap-2 w-full">
                                                        <span className="text-gray-700 font-bold" onDoubleClick={() => handleEditable("JobProfile")}>{data.Profile}</span>
                                                        <p>
                                                            <span className="text-gray-700 mr-2">at {data?.Company}</span>
                                                            <span className="text-gray-700">{data.From} - {data.To}</span>
                                                        </p>
                                                    </div>
                                                    <p className="mt-2">
                                                        {data.Responsibilities}
                                                    </p>
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
                                                    <p className="mt-2">
                                                        {data.Responsibilities}
                                                    </p>
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