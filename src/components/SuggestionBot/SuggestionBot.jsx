import { useState, useEffect } from "react";
import DialogPopup from "../Popup/DialogPopup";
import getResumeSuggestions from "../../appwrite/Suggestions";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../Loader/Loader";

const SuggestionBot = ({ open, setOpen, sectionName, sectionData }) => {

  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sectionName !== "" && sectionData !== "") {
      fetchSuggestions()
    }

  }, [sectionData, sectionName])

  async function fetchSuggestions() {
    const data = await getResumeSuggestions(sectionName, sectionData);
    setSuggestions(data);
    setLoading(false);
  }


  return (
    <>
      <DialogPopup open={open} setOpen={setOpen}>
        <div>
          <div className="w-full flex items-center justify-between">
            <h1 className="text-xl font-bold">Resume Analysis</h1>
            <span onClick={() => { setOpen(false); setSuggestions("") }}><CloseIcon fontSize="medium" /></span>
          </div>
          <p className="text-base font-semibold my-4">{sectionName} Suggestions:</p>
          {
            loading ?
              <Loader />
              :
              <ul className="text-base bg-color1/20 p-2 rounded-lg font-medium">
                {
                  suggestions && suggestions.split('\n').map((data, i) => (
                    <li key={i}>{data}</li>
                  ))
                }
              </ul>
          }
        </div>
      </DialogPopup>
    </>
  );
};

export default SuggestionBot;