import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Loader from "../Loader/Loader";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, authChecked } = useSelector((state) => state.authStatus);
    const location = useLocation();

    // Wait for the session lookup before deciding — rendering children early
    // exposed protected pages (and crashed them with an empty user payload).
    if (!authChecked) return <Loader />;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node,
};

export default ProtectedRoute;
