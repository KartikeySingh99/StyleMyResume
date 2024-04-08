import { useEffect, useState } from "react";
import useMakeURLShort from "../../hooks/useMakeURLShort";
import withTemplateWrapper from "../../components/Template/withTemplateWrapper";
import FormatBar from "../../components/Template/FormatBar";
import BottomNavbar from "../../components/Template/BottomNavbar";
import propTypes from "prop-types";

const Template2 = ({ componentRef, user, margin, setMargin, fontStyle, setFontStyle, zoomLevel, setZoomLevel }) => {

    const [filteredSkills, setFilterSkills] = useState({});

    const { returnUserNameFromURL } = useMakeURLShort()


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

    return (
        <>
            <FormatBar componentRef={componentRef} fontStyle={fontStyle} setFontStyle={setFontStyle} margin={margin} setMargin={setMargin} />
            <div className="w-fit shadow-xl rounded-lg" >
                <div ref={componentRef} className={`${fontStyle} lg:w-[794px] lg:h-[1123px] rounded-lg bg-white ${margin}`}>
                    <div className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold">{user?.userData?.personalDetails?.Name}</h2>
                                <p className="text-base text-gray-600">{user?.userData?.personalDetails?.Designation}</p>
                            </div>
                            <div className="">
                                <p className="text-sm text-gray-600">Phone: {user?.userData?.personalDetails?.PhoneNumber}</p>
                                <p className="text-sm text-gray-600">Email:<a href={`mailto:${user?.userData?.personalDetails?.Email}`}> {user?.userData?.personalDetails?.Email}</a></p>
                                {/* <p className="text-sm text-gray-600">Location: {user?.userData?.personalDetails?.Address}</p> */}
                                <p className="text-sm text-gray-600">LinkedIn: {returnUserNameFromURL(user?.userData?.personalDetails?.LinkedIn)}</p>
                                <p className="text-sm text-gray-600">Github: {returnUserNameFromURL(user?.userData?.personalDetails?.Github)}</p>
                            </div>
                        </div>
                        <hr className="my-4" />
                        {
                            user?.userData?.personalDetails?.CareerObjective &&
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                                <p className="text-sm leading-relaxed">{user?.userData?.personalDetails?.CareerObjective}</p>
                            </div>
                        }
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Experience</h3>
                            {
                                user?.userData?.expirienceDetails?.map((data) => (

                                    <div key={data.Company} className="my-2">
                                        <h4 className="text-base font-semibold">{data.Company}</h4>
                                        <p className="text-sm font-semibold text-gray-600">{data.Profile} | {data.From} - {data.To}</p>
                                        <ul className="list-disc list-outside ml-5 text-sm">
                                            {
                                                data.Responsibilities.split('\n').map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="my-4">
                            <h3 className="text-lg font-semibold mb-2">Projects</h3>
                            {
                                user?.userData?.projectDetails?.map((data) => (

                                    <div key={data.Project} className="my-2">
                                        <h4 className="text-base font-semibold">{data.Project}</h4>
                                        <p className="text-sm font-semibold text-gray-600">{data.SkillsUsed} | {data.Year}</p>
                                        <ul className="list-disc list-outside ml-5 text-sm">
                                            {
                                                data.Description.split('\n').map((point, i) => (
                                                    <li key={i}>{point}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                ))
                            }
                        </div>
                        {
                            user?.userData?.skillDetails &&
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                                <ul className="list-disc list-inside text-sm">
                                    {
                                        Object.entries(filteredSkills).map((skill, index) => (
                                            <li key={index}>
                                                <span className="font-semibold">{skill[0]}:&nbsp;</span>
                                                <span>{skill[1].join(', ')}</span>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {/* <BottomNavbar zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} /> */}
        </>
    );
};

Template2.propTypes = {
    user: propTypes.object,
    fontStyle: propTypes.string,
    margin: propTypes.string
}

const Template2WithLogic = withTemplateWrapper(Template2);

export default Template2WithLogic;