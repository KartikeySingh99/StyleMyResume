import CustomizedAccordions from "./Accordian";

const ResumeReview = ({formData}) => {

    return (
        <>
            <div className="container bg-white border-black h-full rounded-lg shadow-xl px-4">
                <div className="">
                    <h1 className="text-lg font-semibold">Resume Review</h1>
                    <hr />
                    <input type="range" name="" id="" />
                    <CustomizedAccordions formData={formData} />
                </div>
            </div>
        </>
    );
};

export default ResumeReview;