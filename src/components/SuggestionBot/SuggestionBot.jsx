import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DialogPopup from "../Popup/DialogPopup";
import getResumeSuggestions from "../../appwrite/Suggestions";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "../Loader/Loader";

const SuggestionBot = ({ open, setOpen, sectionName, sectionData }) => {

  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !sectionName || !sectionData) return;

    let cancelled = false;

    // Reset on every request — the panel used to keep showing the previous
    // section's suggestions, and rendered error objects as text.
    setLoading(true);
    setError("");
    setSuggestions([]);

    getResumeSuggestions(sectionName, sectionData).then((result) => {
      if (cancelled) return;
      if (result?.error) {
        setError(result.error);
      } else {
        setSuggestions(result?.suggestions ?? []);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [open, sectionData, sectionName])

  const handleClose = () => {
    setOpen(false);
    setSuggestions([]);
    setError("");
  };

  return (
    <>
      <DialogPopup open={open} setOpen={setOpen}>
        <div>
          <div className="w-full flex items-center justify-between">
            <h1 className="text-xl font-bold">Resume Analysis</h1>
            <button type="button" aria-label="Close suggestions" onClick={handleClose}><CloseIcon fontSize="medium" /></button>
          </div>
          <p className="text-base font-semibold my-4">{sectionName} Suggestions:</p>
          {
            loading
              ? <Loader />
              : error
                ? <p className="text-base bg-red-50 text-red-700 p-3 rounded-lg font-medium">{error}</p>
                : (
                  <ul className="text-base bg-color1/20 p-2 rounded-lg font-medium list-disc list-inside">
                    {suggestions.map((suggestion, i) => (
                      <li key={i} className="my-1">{suggestion}</li>
                    ))}
                  </ul>
                )
          }
        </div>
      </DialogPopup>
    </>
  );
};

SuggestionBot.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  sectionName: PropTypes.string,
  sectionData: PropTypes.string,
};

export default SuggestionBot;
