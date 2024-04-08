import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchUserData } from "../../slices/userSlice";
import { useReactToPrint } from 'react-to-print';
import Loader from "../../components/Loader/Loader";
import useMakeURLShort from "../../hooks/useMakeURLShort";
import FormatBar from "../../components/Template/FormatBar";
import Template1 from "./Template1";
import Template2 from "./Template2";

const Demo = () => {

    const dispatch = useDispatch();


    const { user, loading } = useSelector((state) => state.user);
    const { userData } = useSelector((state) => state.authStatus)

    const [fontStyle, setFontStyle] = useState("font-sans")
    const [margin, setMargin] = useState("p-5");

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // useEffect(() => {
    //     componentRef.current.style.fontFamily = fontStyle;
    // }, [fontStyle])



    useEffect(() => {
        if (userData) {
            dispatch(fetchUserData(userData))
        }
    }, [dispatch, userData])



    console.log(user);
    

    // const { personalDetails, educationalDetails, expirienceDetails, skillDetails, projectDetails } = user;

    return loading ?
        <Loader />
        :
        (
            <>
                <div className="flex items-center justify-center flex-col gap-y-4 bg-gray-100 py-16">
                    <FormatBar setFontStyle={setFontStyle} fontStyle={fontStyle} margin={margin} setMargin={setMargin} printButton={handlePrint} />
                    <Template2 componentRef={componentRef} fontStyle={fontStyle} margin={margin} user={user} />
                </div >
            </>
        )
}

export default Demo