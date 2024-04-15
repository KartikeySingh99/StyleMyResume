import { useNavigate } from "react-router-dom";
import Template1 from "/resume1.webp";
import Template2 from "/resume2.webp";
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
                    <div key={data.image} className="template relative shadow-xl border border-gray-200 w-[290px] h-[410px] flex items-center justify-center">
                        <div className="">
                            <img src={data.image} width={300} height={500} alt="" />
                        </div>
                        <button className="absolute z-10 text-md font-bold px-6 py-2 rounded-xl bg-primary text-white" onClick={() => navigate(data.url)}>Use This Template</button>
                    </div>

                ))
            }

        </>
    );
};

export default TemplatePreview;