import { useRef } from "react";
import navbarContext from "../layout/navbarContext";
import { useReactToPrint } from 'react-to-print';

const FormatBar = ({
    setFontStyle,
    setFontSize,
    fontStyle,
    fontSize,
    margin,
    setMargin,
    componentRef
}) => {

    // const navbarHeight = useContext(navbarContext);
    // console.log("navbar ki height=>",navbarHeight);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <>
            <div className="shadow-md sticky top-[50px] md:top-[50px] lg:top-[60px] z-10 w-full bg-white flex items-center justify-between px-2 md:px-4 lg:px-6">
                <div className="flex items-center justify-center">
                    <div className="lg:px-4 py-2">
                        <h1 className="font-semibold text-sm mb-1">Font Styles</h1>
                        <select name="" className="text-sm lg:text-base border rounded-sm border-gray-300" value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
                            <option value="" disabled>Select Font</option>
                            <option value="font-mono">Mono</option>
                            <option value="font-Inter">Inter</option>
                            <option value="font-sans">Sans</option>
                            <option value="font-serif">Serif</option>
                            <option value="font-Oswald">Oswald</option>
                        </select>
                    </div>
                    <div className="px-4 py-2">
                        <h1 className="font-semibold text-sm mb-1">Margin</h1>
                        <select name="" className="text-sm lg:text-base border rounded-sm border-gray-300" value={margin} onChange={(e) => setMargin(e.target.value)}>
                            <option value="" disabled>Select Margin</option>
                            <option value="px-6 py-2">Normal</option>
                            <option value="px-4 py-2">Narrow</option>
                            <option value="px-8 py-4">Wide</option>
                        </select>
                    </div>
                </div>
                <div>
                    <button className="text-sm px-4 py-2 bg-primary text-white rounded-lg" onClick={handlePrint}>Download</button>
                </div>
                {/* <div className="px-4 py-2">
                    <h1 className="font-semibold text-sm">Font Size</h1>
                    <select name="" className="border rounded-sm border-gray-300" value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                        <option value="text-xs">12px</option>
                        <option value="text-sm">14px</option>
                        <option value="text-base">16px</option>
                        <option value="text-lg">18px</option>
                        <option value="text-xl">20px</option>
                        <option value="text-2xl">24px</option>
                    </select>
                </div> */}
            </div>
        </>
    );
};

export default FormatBar;