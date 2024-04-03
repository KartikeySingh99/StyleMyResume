const FormatBar = ({
    setFontStyle,
    setFontSize,
    fontStyle,
    fontSize,
    margin,
    setMargin,
    printButton
}) => {

    return (
        <>
            <div className="sticky top-14 w-full h-full bg-white flex items-center justify-between px-2 md:px-4 lg:px-6">
                <div className="flex items-center justify-center divide-x-2">
                    <div className="px-4 py-2">
                        <h1 className="font-semibold text-sm">Font Styles</h1>
                        <select name="" className="border rounded-sm border-gray-300" value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
                            <option value="" disabled>Select Font</option>
                            <option value="font-mono">Mono</option>
                            <option value="font-Inter">Inter</option>
                            <option value="font-sans">Sans</option>
                            <option value="font-serif">Serif</option>
                            <option value="font-Oswald">Oswald</option>
                        </select>
                    </div>
                    <div className="px-4 py-2">
                        <h1 className="font-semibold text-sm">Margin</h1>
                        <select name="" className="border rounded-sm border-gray-300" value={margin} onChange={(e) => setMargin(e.target.value)}>
                            <option value="" disabled>Select Margin</option>
                            <option value="p-5">Normal</option>
                            <option value="px-4 py-2">Narrow</option>
                            <option value="px-8 py-4">Wide</option>
                        </select>
                    </div>
                </div>
                <div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg" onClick={printButton}>Download</button>
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