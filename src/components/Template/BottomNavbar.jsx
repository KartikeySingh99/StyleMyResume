import { useState } from "react";

const BottomNavbar = ({ zoomLevel, setZoomLevel }) => {



    return (
        <>
            <div className="w-full h-12 flex items-center justify-center bg-white fixed bottom-0">
                <div className="flex items-center justify-center gap-x-4 w-full">
                    <p className="text-base font-semibold">Zoom:</p>
                    <input type="range" name="" max={200} min={50} step={10} id="" value={zoomLevel} onChange={(e)=>setZoomLevel(parseInt(e.target.value))} />
                    <p className="text-base">{zoomLevel}</p>
                </div>
            </div>
        </>
    );
};

export default BottomNavbar;