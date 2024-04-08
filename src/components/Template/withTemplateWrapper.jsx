import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../slices/userSlice";
import { useReactToPrint } from 'react-to-print';

const withTemplateWrapper = (WrappedComponent) => {
    return function WithTemplateWrapper(props) {

        const dispatch = useDispatch();

        const componentRef = useRef();
        // const handlePrint = useReactToPrint({
        //     content: () => componentRef.current,
        // });

        const { user } = useSelector((state) => state.user);
        const { userData } = useSelector((state) => state.authStatus)
        const [fontStyle, setFontStyle] = useState("font-sans")
        const [margin, setMargin] = useState("px-8 py-4");
        const [zoomLevel, setZoomLevel] = useState(60); // Default zoom level

        useEffect(() => {
            if (userData) {
                dispatch(fetchUserData(userData))
            }
        }, [dispatch, userData])

        useEffect(() => {
            if (componentRef.current) {
              const content = componentRef.current;
              content.scrollLeft *= zoomLevel / 100;
              content.scrollTop *= zoomLevel / 100;
            }
          }, [zoomLevel]);

        return (
            <div className="flex items-center justify-center flex-col gap-y-4 bg-gray-100 py-16 rounded-lg shadow-xl">
                <WrappedComponent
                    {...props}
                    user={user}
                    fontStyle={fontStyle}
                    setFontStyle={setFontStyle}
                    margin={margin}
                    setMargin={setMargin}
                    zoomLevel={zoomLevel}
                    setZoomLevel={setZoomLevel}
                    componentRef={componentRef}
                />
            </div>
        )
    }
};

export default withTemplateWrapper;