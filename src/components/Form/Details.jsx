import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { saveUserData, editData, fetchUserData } from '../../slices/userSlice';
import { dropEmptyRows, findMissingRequiredField } from '../../utils/text';
import Form from './Form';
import Loader from "../Loader/Loader";
import ResumeReview from '../ResumeReview/ResumeReview';
import ReviewPopup from '../ResumeReview/ReviewPopup';
import Review from "/review.png";

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

    const [open, setOpen] = useState(false)

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
            setPersonalDetails(user?.userData?.personalDetails);
            setEducationDetails(user?.userData?.educationalDetails);
            setExperienceDetails(user?.userData?.expirienceDetails);
            setProjectDetails(user?.userData?.projectDetails);
            setSkillDetails(user?.userData?.skillDetails);
            setDetailedData(user?.userData)
        }
        else if (actionType === "create") {
            setPersonalDetails({ Name: "", Email: "", PhoneNumber: "", Address: "", Designation: "", CareerObjective: "", LinkedIn: "", Github: "" });
            setEducationDetails([{ Course: "", InstituteName: "", Year: "", Marks: "" }])
            setExperienceDetails([{ Company: "", Profile: "", From: "", To: '', Responsibilities: "" }])
            setProjectDetails([{ Project: "", Description: "", Link: "", Year: "", SkillsUsed: "" }])
            setSkillDetails([{ Skill: "", skillType: "" }])
        }
    }, [actionType, user])


    const personalDetailsFields = [
        {
            name: "Name",
            placeholder: "Enter Name",
            type: "text",
            isRequired: true,
            validate: "Name is required!"
        },
        {
            name: "Email",
            placeholder: "Enter Email Id",
            type: "email",
            isRequired: true,
            validate:"Email is required!"
        },
        {
            name: "PhoneNumber",
            placeholder: "Enter Phone Number",
            type: "tel",
            isRequired: true,
            validate:"Phone Number is required!"
        },
        {
            name: "Address",
            placeholder: "Enter Address Only State or City",
            type: "text",
            isRequired: false,
        },
        {
            name: "Designation",
            placeholder: "Enter Current Designation",
            type: "text",
            isRequired: false,
        },
        {
            name: "CareerObjective",
            placeholder: "Enter Your Carrer Objective",
            type: "text",
            isRequired: false,
        },
        {
            name: "LinkedIn",
            placeholder: "Paste Your LinkedIn Account Link",
            type: "text",
            isRequired: true,
            validate:"LinkedIn url is required!"
        },
        {
            name: "Github",
            placeholder: "Paste Your Github Account Link",
            type: "text",
            isRequired: false,
        },
    ];

    const educationDetailsFields = [
        {
            name: "Course",
            placeholder: "Enter Your Course Name",
            type: "text",
            isRequired: true
        },
        {
            name: "InstituteName",
            placeholder: "Enter Institute/School Name",
            type: "text",
            isRequired: true
        },
        {
            name: "Year",
            placeholder: "Enter Year of Completion",
            type: "text",
            isRequired: true
        },
        {
            name: "Marks",
            placeholder: "Enter Your Marks",
            type: "number",
            isRequired: false
        }
    ];

    const skillsFields = [
        {
            name: "Skill",
            type: "text",
            placeholder: "Enter Your Skill",
            isRequired: false
        },
        {
            name: "skillType",
            type: "select",
            placeholder: "e.g Frontend Tools",
            isRequired: false
        },
    ]

    const projectFields = [
        {
            name: "Project",
            type: "text",
            placeholder: "Enter Project Name",
            isRequired: true
        },
        {
            name: "Link",
            type: "text",
            placeholder: "Paste Your Project Link",
            isRequired: true
        },
        {
            name: "Year",
            type: "text",
            placeholder: "Enter Year",
            isRequired: false
        },
        {
            name: "SkillsUsed",
            type: "text",
            placeholder: "Enter Skills Used In This Project",
            isRequired: true
        },
        {
            name: "Description",
            type: "text",
            placeholder: "Enter Project Description",
            isRequired: true
        },
    ];

    const experienceFields = [
        {
            name: "Company",
            placeholder: "Enter Company Name",
            type: "text",
            isRequired: true
        },
        {
            name: "Profile",
            placeholder: "Enter Profile",
            type: "text",
            isRequired: true
        },
        {
            name: "From",
            placeholder: "ex - dd/mm/yyyy",
            type: "text",
            isRequired: true
        },
        {
            name: "To",
            placeholder: "ex - dd/mm/yyyy or Present",
            type: "text",
            isRequired: true
        },
        {
            name: "Responsibilities",
            placeholder: "Enter key responsibilities",
            type: "text",
            isRequired: true
        },
    ]


    /**
     * Validates a repeatable section before storing it. Previously the check only
     * looked at the last row and advanced the tab regardless, so an invalid section
     * was dropped from the saved resume without telling the user.
     */
    const commitSection = (rows, fields, sectionKey, setSection, nextTab) => {
        const cleanedRows = dropEmptyRows(rows);
        const missingField = findMissingRequiredField(cleanedRows, fields);

        if (missingField) {
            toast.error(`Please fill "${missingField}" before continuing.`);
            return null;
        }

        setSection(cleanedRows);
        setDetailedData((prev) => ({ ...prev, [sectionKey]: cleanedRows }));
        if (nextTab !== undefined) setValue(nextTab);
        return cleanedRows;
    }

    const handlePersonalData = (data) => {
        setPersonalDetails(data)
        setDetailedData((prev) => ({ ...prev, personalDetails: data }))
        setValue(1)
    }

    const handleEducationalData = (data) => {
        commitSection(data.educationDetailsArray, educationDetailsFields, "educationalDetails", setEducationDetails, 2);
    }

    const handleExperienceData = (data) => {
        commitSection(data.experienceArray, experienceFields, "expirienceDetails", setExperienceDetails, 3);
    }

    const handleSkillData = (data) => {
        commitSection(data.skillsArray, skillsFields, "skillDetails", setSkillDetails, 4);
    }

    const handleProjectData = (data) => {
        const projects = commitSection(data.projectsArray, projectFields, "projectDetails", setProjectDetails);
        if (projects) {
            handleAllDetails({ ...detailedData, projectDetails: projects });
        }
    }

    const handleAllDetails = (data) => {
        // Only navigate once the write actually succeeded.
        const action = actionType === "create"
            ? saveUserData({ userID: userData?.userId ?? userData?.$id, data })
            : editData({ userID: userData?.$id, userData: data });

        dispatch(action)
            .unwrap()
            .then(() => {
                toast.success(actionType === "create" ? "Details saved!" : "Details updated!", { autoClose: 1000 });
                navigate("/profile");
            })
            .catch((message) => toast.error(message || "Could not save your details."));
    }


    return (
        loading ?
            <Loader />
            :
            <>
                <div className='relative mt-12 md:mt-16 w-full flex items-start justify-center gap-x-4 md:px-4 md:py-4'>
                    <div className='lg:block hidden w-[30%]'>
                        <ResumeReview formData={detailedData} />
                    </div>
                    <div className="w-full md:w-[80%] lg:w-[70%] xl:w-[50%] border shadow-xl rounded-lg bg-white">
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
                                    CareerObjective: personalDetails && personalDetails.CareerObjective,
                                    LinkedIn: personalDetails && personalDetails.LinkedIn,
                                    Github: personalDetails && personalDetails.Github
                                }}
                                value={value}
                                setValue={setValue}
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
                            {/*<button onClick={() => handleAllDetails(detailedData)}>Save</button>*/}
                        </CustomTabPanel>
                    </div>
                </div>
                <div className='block lg:hidden container shadow-2xl border bg-white rounded-full fixed right-2 bottom-4 w-fit animate-bounce'>
                    <button className='text-sm font-semibold flex items-center justify-center' onClick={() => setOpen(true)}> <img src={Review} className='object-contain' width={50} alt="" /> </button>
                </div>
                <ReviewPopup formData={detailedData} open={open} setOpen={setOpen} />
            </>
    )
}

export default Details;