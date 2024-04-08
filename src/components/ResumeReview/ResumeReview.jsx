import CustomizedAccordions from "./Accordian";


const ResumeReview = ({ formData, open, setOpen }) => {

    return (
        <>
                <div className="container bg-white h-full rounded-lg shadow-lg">
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-lg font-semibold">Resume Review</h1>
                            {/* <span className="text-gray-500 hover:cursor-pointer">
                                <CloseIcon fontSize="medium" onClick={() => setOpen(false)} />
                            </span> */}
                        </div>
                        <hr />
                        {/* <input type="range" name="" id="" /> */}
                        <CustomizedAccordions formData={formData} />
                    </div>
                </div>
        </>
    );
};

export default ResumeReview;