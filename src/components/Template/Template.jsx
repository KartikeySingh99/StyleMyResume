import { useNavigate } from "react-router-dom";
import Template1 from "/template1.webp";
import Template2 from "/template2.png";
import Template3 from "/template3.png";
import Template4 from "/template4.webp";
import "./template.css";

const Template = () => {

    const templateData = [
        {
            image: Template1
        },
        {
            image: Template2
        },
        {
            image: Template3
        },
        {
            image: Template4
        },
    ]

    const navigate = useNavigate();

    return (
        <>
            {
                templateData.map((data, i) => (
                    <div key={i} className="template group relative border w-[290px] h-[410px] flex items-center justify-center">
                        <div className="">
                            <img src={data.image} alt="" />
                        </div>
                        <button className="absolute z-10 text-md font-bold px-6 py-2 rounded-xl bg-primary text-white" onClick={() => navigate('/template1')}>Use This Template</button>
                    </div>
                ))
            }
        </>
    );
};

export default Template;