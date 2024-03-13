import { useEffect, useRef } from "react";
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

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        if (userData) {
            dispatch(fetchUserData(userData))
        }
    }, [dispatch, userData])

    // const { personalDetails, educationalDetails, expirienceDetails, skillDetails, projectDetails } = user;

    // console.log(user);

    return loading ?
        <Loader />
        :
        (
            <>
                <div className="flex items-center justify-center flex-col gap-y-4 bg-gray-100 md:py-16 overflow-hidden">
                    <div ref={componentRef} className="scale-50 md:scale-100 w-[794px] rounded-lg bg-white">
                        <div className="flex rounded-t-lg sm:px-2 w-full">
                            <div className="my-4 flex items-center justify-center gap-y-2 flex-col text-center pl-5 w-full">
                                <p className="font-poppins font-bold text-heading sm:text-4xl text-2xl">
                                    {user?.personalDetails?.Name}
                                </p>
                                <p className="font-semibold text-lg">{user?.personalDetails?.Designation}</p>
                            </div>
                        </div>
                        <div className="border-2 w-full text-center my-3" />

                        {/* main content */}
                        <div className="p-5">
                            <div className="grid grid-cols-2 gap-x-2">
                                <div className="flex flex-col w-4/5 px-4">
                                    {/* My contact */}
                                    <div className="py-3 sm:order-none">
                                        <h2 className="text-lg font-poppins font-bold text-top-color">My Contact</h2>
                                        <div className="border-2 w-20 border-top-color my-3" />
                                        <div>
                                            <div className="flex items-start justify-start gap-x-2 my-1">
                                                <a className="text-gray-700" href=""><EmailIcon fontSize="medium" /></a>
                                                <p className="truncate">{user?.personalDetails?.Email}</p>
                                            </div>
                                            <div className="flex items-start justify-start gap-x-2 my-1">
                                                <a className="text-gray-700" href=""><PhoneIcon fontSize="medium" /></a>
                                                <p className="text-md">{user?.personalDetails?.PhoneNumber}</p>
                                            </div>
                                            <div className="flex items-start justify-start gap-x-2 my-1">
                                                <a className="text-gray-700" href=""><HomeIcon fontSize="medium" /></a>
                                                <p className="text-md">{user?.personalDetails?.Address}</p>
                                            </div>
                                            <div className="flex items-start justify-start gap-x-2 my-1">
                                                <a className="text-gray-700" href=""><LinkedInIcon fontSize="medium" /></a>
                                                <p className="text-md">amitpachange21</p>
                                            </div>
                                            <div className="flex items-start justify-start gap-x-2 my-1">
                                                <a className="text-gray-700" href=""><GitHubIcon fontSize="medium" /></a>
                                                <p className="text-md">amitpachange21</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Skills */}
                                    {user?.skillDetails &&
                                        <div className="py-3 sm:order-none order-2">
                                            <h2 className="text-lg font-poppins font-bold text-top-color">Skills</h2>
                                            <div className="border-2 w-20 border-top-color my-3" />
                                            <div>
                                                {
                                                    user?.skillDetails && user?.skillDetails.map((data, i) => (

                                                        <div key={i} className="flex items-center my-1">
                                                            <a className="w-6 text-gray-700 hover:text-orange-600">
                                                                <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill="currentColor" d="M7.50006 2.5C6.47409 2.5 5.59203 2.77691 4.89966 3.37037C4.21227 3.95956 3.76259 4.81729 3.51314 5.88638C3.45869 6.1197 3.57742 6.35885 3.79619 6.45654C4.01496 6.55423 4.27228 6.483 4.40967 6.28672C4.7263 5.8344 5.04244 5.56261 5.3462 5.42313C5.64038 5.28805 5.95748 5.26068 6.32069 5.35797C6.68723 5.45615 6.97097 5.74369 7.41643 6.22816L7.43082 6.24382C7.76661 6.60905 8.17623 7.0546 8.73649 7.40028C9.31785 7.75898 10.0413 7.99999 11.0001 7.99999C12.026 7.99999 12.9081 7.72307 13.6005 7.12962C14.2878 6.54043 14.7375 5.6827 14.987 4.61361C15.0414 4.38029 14.9227 4.14114 14.7039 4.04345C14.4852 3.94576 14.2278 4.01698 14.0904 4.21326C13.7738 4.66559 13.4577 4.93737 13.1539 5.07686C12.8597 5.21194 12.5426 5.23931 12.1794 5.14202C11.8129 5.04384 11.5291 4.7563 11.0837 4.27182L11.0693 4.25616C10.7335 3.89093 10.3239 3.44538 9.76362 3.09971C9.18227 2.74101 8.45883 2.5 7.50006 2.5Z" />
                                                                    <path fill="currentColor" d="M4.00006 6.99999C2.97409 6.99999 2.09203 7.2769 1.39966 7.87036C0.712271 8.45955 0.262592 9.31727 0.0131365 10.3864C-0.0413057 10.6197 0.0774162 10.8588 0.296186 10.9565C0.514956 11.0542 0.772276 10.983 0.909673 10.7867C1.2263 10.3344 1.54244 10.0626 1.8462 9.92312C2.14038 9.78804 2.45747 9.76067 2.82069 9.85796C3.18723 9.95614 3.47097 10.2437 3.91643 10.7282L3.93082 10.7438C4.2666 11.109 4.67624 11.5546 5.23649 11.9003C5.81785 12.259 6.54128 12.5 7.50006 12.5C8.52602 12.5 9.40808 12.2231 10.1005 11.6296C10.7878 11.0404 11.2375 10.1827 11.487 9.1136C11.5414 8.88027 11.4227 8.64113 11.2039 8.54343C10.9852 8.44574 10.7278 8.51697 10.5904 8.71325C10.2738 9.16558 9.95768 9.43736 9.65391 9.57684C9.35974 9.71192 9.04264 9.7393 8.67942 9.64201C8.31289 9.54383 8.02915 9.25628 7.58369 8.77181L7.56929 8.75615C7.23351 8.39092 6.82388 7.94537 6.26362 7.59969C5.68227 7.241 4.95883 6.99999 4.00006 6.99999Z" />
                                                                </svg>
                                                            </a>
                                                            <div className="ml-2 uppercase">{data.Skill}</div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    }
                                    {/* Education Background */}
                                    {user?.educationalDetails &&
                                        <div className="py-3 sm:order-none order-1">
                                            <h2 className="text-lg font-poppins font-bold text-top-color">Education Background</h2>
                                            <div className="border-2 w-20 border-top-color my-3" />
                                            <div className="flex flex-col space-y-1">
                                                {
                                                    user?.educationalDetails?.educationDetailsArray.map((data, i) => (
                                                        <div key={i} className="flex flex-col">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm font-semibold">
                                                                    {data.Course}
                                                                </p>
                                                                <p className="font-bold text-xs text-gray-700">{data.Year}</p>
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm text-gray-700 font-semibold">{data.InstituteName}</p>
                                                                <p className="font-bold text-xs text-gray-700 mb-2">{data.Marks}%</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-col w-full">
                                    {/* About me */}
                                    {
                                        user?.personalDetails?.CareerObjective &&
                                        <div className="py-3">
                                            <h2 className="text-lg font-poppins font-bold text-top-color">About Me</h2>
                                            <div className="border-2 w-20 border-top-color my-3" />
                                            <p>{user?.personalDetails?.CareerObjective}</p>
                                        </div>
                                    }
                                    {/* Professional Experience */}
                                    {
                                        user?.expirienceDetails &&
                                        <div className="py-3">
                                            <h2 className="text-lg font-poppins font-bold text-top-color">Professional Experience</h2>
                                            <div className="border-2 w-20 border-top-color my-3" />
                                            <div className="flex flex-col">
                                                {
                                                    user?.expirienceDetails?.experienceArray.map((data, i) => (

                                                        <div key={i} className="flex flex-col">
                                                            <p className="text-lg font-bold text-gray-700">{data.Company} | {data.Profile}</p>
                                                            <p className="font-semibold text-sm text-gray-700">{data.From} - {data.To}</p>
                                                            <p className="font-semibold text-sm text-gray-700 mt-2 mb-1">Key Responsibilities</p>
                                                            <p className="font-semibold text-sm text-gray-700 mt-2 mb-1">{data.Responsibilities}</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    }
                                    {/* Projects */}
                                    {
                                        user?.projectDetails &&
                                        <div className="py-3">
                                            <h2 className="text-lg font-poppins font-bold text-top-color">Projects</h2>
                                            <div className="border-2 w-20 border-top-color my-3" />
                                            <div className="flex flex-col">
                                                {user?.projectDetails?.projectsArray.map((data, i) => (

                                                    <div key={i} className="flex flex-col">
                                                        <p className="text-lg font-semibold text-gray-700">{data.Project}</p>
                                                        <p className="font-normal text-sm text-gray-700 mb-1 pl-2">{data.Description}</p>
                                                    </div>
                                                ))
                                                }
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="w-fit bg-primary px-6 py-2 text-white rounded-sm" onClick={handlePrint}>Print</button>

                </div>
            </>
        )
}

export default Demo