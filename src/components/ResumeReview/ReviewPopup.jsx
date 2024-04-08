import ResumeReview from "./ResumeReview";
import DialogPopup from "../Popup/DialogPopup";
import CloseIcon from "@mui/icons-material/Close";
import CustomizedAccordions from "./Accordian";


const ReviewPopup = ({ open, setOpen, formData }) => {

    return (
        <>
            <DialogPopup open={open} setOpen={setOpen}>
                <div className="container bg-white h-full">
                    <div className="">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-lg font-semibold">Resume Review</h1>
                            <span className="text-gray-500 hover:cursor-pointer">
                                <CloseIcon fontSize="medium" onClick={() => setOpen(false)} />
                            </span>
                        </div>
                        <hr />
                        {/* <input type="range" name="" id="" /> */}
                        <CustomizedAccordions formData={formData} />
                    </div>
                </div>
            </DialogPopup>
        </>
    );
};

export default ReviewPopup;