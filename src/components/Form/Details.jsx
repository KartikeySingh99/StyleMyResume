import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { saveData, editData, fetchUserData } from '../../slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import Form from './Form';
import Loader from "../Loader/Loader";
import { useNavigate } from 'react-router-dom';


function CustomTabPanel(props) {

    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <h3>{children}</h3>
                </Box>
            )}
        </div>
    );
}

const Details = ({ actionType }) => {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { userData } = useSelector((state) => state.authStatus);

    const { user, loading, isUpdated } = useSelector((state) => state.user)


    const [value, setValue] = useState(0);
    const [detailedData, setDetailedData] = useState({});
    const [educationalDetails, setEducationDetails] = useState([]);
    const [expirienceDetails, setExperienceDetails] = useState([]);
    const [skillDetails, setSkillDetails] = useState([]);
    const [personalDetails, setPersonalDetails] = useState({});
    const [projectDetails, setProjectDetails] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (userData && actionType === "edit") {
            dispatch(fetchUserData(userData))
        }
    }, [dispatch, userData, actionType])

    useEffect(() => {
        if (user && actionType === "edit") {
            setPersonalDetails(user?.personalDetails);
            setEducationDetails(user?.educationalDetails?.educationDetailsArray);
            setExperienceDetails(user?.expirienceDetails?.experienceArray);
            setSkillDetails(user?.skillDetails);
            setProjectDetails(user?.projectDetails?.projectsArray);
        }
        else if (actionType === "create") {
            setPersonalDetails({ Name: "", Email: "", PhoneNumber: "", Address: "", Designation: "", CareerObjective: "" });
            setEducationDetails([{ Course: "", InstituteName: "", Year: "", Marks: "" }])
            setExperienceDetails([{ Company: "", Profile: "", From: "", To: '', Responsibilities: "" }])
            setProjectDetails([{ Project: "", Description: "", Link: "" }])
            setSkillDetails([{ Skill: "" }])
        }
    }, [actionType, user])


    const personalDetailsFields = [
        {
            name: "Name",
            placeholder: "Enter Name",
            type: "text"
        },
        {
            name: "Email",
            placeholder: "Enter Email Id",
            type: "email"
        },
        {
            name: "PhoneNumber",
            placeholder: "Enter Phone Number",
            type: "tel"
        },
        {
            name: "Address",
            placeholder: "Enter Address",
            type: "text"
        },
        {
            name: "Designation",
            placeholder: "Enter Current Designation",
            type: "text"
        },
        {
            name: "CareerObjective",
            placeholder: "Enter Your Carrer Objective",
            type: "text"
        }
    ];

    const educationDetailsFields = [
        {
            name: "Course",
            placeholder: "Enter Your Course Name",
            type: "text"
        },
        {
            name: "InstituteName",
            placeholder: "Enter Institute/School Name",
            type: "text"
        },
        {
            name: "Year",
            placeholder: "Enter Year of Completion",
            type: "text"
        },
        {
            name: "Marks",
            placeholder: "Enter Your Marks",
            type: "number"
        }
    ];

    const skillsFields = [
        {
            name: "Skill",
            type: "text",
            placeholder: "Enter Your Skill"
        }
    ]

    const projectFields = [
        {
            name: "Project",
            type: "text",
            placeholder: "Enter Project Name"
        },
        {
            name: "Description",
            type: "text",
            placeholder: "Enter Project Description"
        },
        {
            name: "Link",
            type: "text"
        }
    ];

    const experienceFields = [
        {
            name: "Company",
            placeholder: "Enter Company Name",
            type: "text"
        },
        {
            name: "Profile",
            placeholder: "Enter Profile",
            type: "text"
        },
        {
            name: "From",
            placeholder: "Joining Date",
            type: "date"
        },
        {
            name: "To",
            placeholder: "Last Working Date",
            type: "date"
        },
        {
            name: "Responsibilities",
            placeholder: "Enter key responsibilities",
            type: "text"
        },
        // {
        //     name:"Responsibilities1",
        //     placeholder: "Enter key responsibilities",
        //     type: "text"
        // },
        // {
        //     name:"Responsibilities2",
        //     placeholder: "Enter key responsibilities",
        //     type: "text"
        // },
        // {
        //     name:"Responsibilities3",
        //     placeholder: "Enter key responsibilities",
        //     type: "text"
        // },
    ]

    const handlePersonalData = (data) => {
        setDetailedData((prev) => ({ ...prev, personalDetails: data }))
        setValue(1)
    }

    const handleEducationalData = (data) => {
        let isEmpty = false;
        data.educationDetailsArray.map((data) => {
            if (Object.values(data).includes('')) {
                return isEmpty = true;
            }
            return isEmpty = false;
        })
        if (!isEmpty) {
            setDetailedData((prev) => ({ ...prev, educationalDetails: data }))
        }
        setValue(2)
    }

    const handleSkillData = (data) => {
        // const skills = data.Skill.split(',');
        setDetailedData((prev) => ({ ...prev, skillDetails: data.skillsArray }))
        setValue(4)
    }

    const handleExperienceData = (data) => {
        let isEmpty = false;
        data.experienceArray.map((data) => {
            if (Object.values(data).includes('')) {
                return isEmpty = true;
            }
            return isEmpty = false;
        })
        if (!isEmpty) {
            setDetailedData((prev) => ({ ...prev, expirienceDetails: data }))
        }
        setValue(3)
    }

    const handleProjectData = (data) => {
        let isEmpty = false;
        data.projectsArray.map((data) => {
            if (Object.values(data).includes('')) {
                return isEmpty = true;
            }
            return isEmpty = false;
        })
        if (!isEmpty) {
            setDetailedData((prev) => ({ ...prev, projectDetails: data }))
            navigate("/profile");
        }
        // dispatch(saveData(detailedData))
    }

    const handleAllDetails = (data) => {
        if (actionType === "create") {
            dispatch(saveData({ userID: userData?.$id, data }));
        }
        else if (actionType === "edit") {
            dispatch(editData({ userID: userData?.$id, userData: data }));
        }
    }

    // console.log(user);

    // console.log(personalDetails);

    // console.log(personalDetails);
    // console.log(educationalDetails);
    // console.log(skillDetails);
    // console.log(expirienceDetails);

    return (
        loading ?
            <Loader />
            :
            <>
                <div className='mt-24 w-full flex items-center justify-center'>
                    <div className="w-full lg:max-w-[50vw]  min-h-[70vh] border shadow-xl rounded-lg">
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Contact Details" />
                                <Tab label="Educational Details" />
                                <Tab label="Experience" />
                                <Tab label="Skills" />
                                <Tab label="Projects" />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <Form
                                sectionName='Personal Details'
                                label="personalDetails"
                                formFields={personalDetailsFields}
                                defaultValues={{
                                    Name: personalDetails && personalDetails.Name,
                                    Email: personalDetails && personalDetails.Email,
                                    PhoneNumber: personalDetails && personalDetails.PhoneNumber,
                                    Address: personalDetails && personalDetails.Address,
                                    Designation: personalDetails && personalDetails.Designation,
                                    CareerObjective: personalDetails && personalDetails.CareerObjective
                                }}
                                onSubmit={handlePersonalData}
                            />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <Form
                                sectionName='Education Details'
                                label="educationDetails"
                                dynamicFields={educationDetailsFields}
                                defaultValues={{
                                    educationDetailsArray: educationalDetails
                                }}
                                onSubmit={handleEducationalData}
                                value={value}
                                setValue={setValue}
                            />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <Form
                                sectionName='Experience'
                                label='experience'
                                dynamicFields={experienceFields}
                                defaultValues={{ experienceArray: expirienceDetails }}
                                onSubmit={handleExperienceData}
                                value={value}
                                setValue={setValue}
                            />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={3}>
                            <Form
                                sectionName='Skills'
                                label="skills"
                                dynamicFields={skillsFields}
                                defaultValues={{ skillsArray: skillDetails }}
                                onSubmit={handleSkillData}
                                value={value}
                                setValue={setValue}
                            />
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={4}>
                            <Form
                                sectionName='Projects'
                                label="projects"
                                dynamicFields={projectFields}
                                defaultValues={{
                                    projectsArray: projectDetails
                                }}
                                onSubmit={handleProjectData}
                                value={value}
                                setValue={setValue} />
                            <button onClick={() => handleAllDetails(detailedData)}>Save</button>
                        </CustomTabPanel>
                    </div>
                </div>
            </>
    )
}

export default Details;