import Slider from '@mui/material/Slider';
import { useState } from 'react';

const Template1 = () => {

    const [zoomLevel, setZoomLevel] = useState(75);


    const marks = [
        {
            value: 50,
            label: '50%',
        },
        {
            value: 75,
            label: '75%',
        },
        {
            value: 90,
            label: '90%',
        },
        {
            value: 100,
            label: '100°C',
        },
        {
            value: 105,
            label: '105%',
        },
    ];

    return (
        <>
            <div className="w-full min-h-screen border flex items-center justify-center">
                <div className={`border-2 w-[794px] h-[1123px] scale-${zoomLevel}`}>
                    template
                </div>
            </div>
            <div className='w-1/2 px-6'>
                <Slider marks={marks} step={null} defaultValue={50} min={50} max={105} value={zoomLevel} onChange={(e) => setZoomLevel(e.target.value)} aria-label="Default" valueLabelDisplay="auto" />
            </div>
        </>
    );
};

export default Template1;