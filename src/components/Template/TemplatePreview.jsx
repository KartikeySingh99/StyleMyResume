import { useNavigate } from "react-router-dom";
import Template1 from "/template.webp";
import Template2 from "/template2.png";
import Template3 from "/template3.png";
import Template4 from "/template4.webp";
import Template5 from "/template.webp";
import "./template.css";

const TemplatePreview = () => {

    const templateData = [
        {
            image: Template1,
            url: "/template1"
        },
        {
            image: Template2,
            url: "/template2"
        },
    ]

    const navigate = useNavigate();

    return (
        <>
            {
                templateData.map((data) => (
                    <div key={data.image} className="template relative border border-black w-[290px] h-[410px] flex items-center justify-center">
                        <div className="">
                            <img src={data.image} alt="" />
                        </div>
                        <button className="absolute z-10 text-md font-bold px-6 py-2 rounded-xl bg-primary text-white" onClick={() => navigate(data.url)}>Use This Template</button>
                    </div>

                ))
            }

        </>
    );
};

export default TemplatePreview;