import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {


    const { isAuthenticated, loading, userData } = useSelector((state) => state.authStatus);

    // console.log(isAuthenticated);
    // console.log(userData);

    if (!isAuthenticated && !userData) {
        return <Navigate to="/login" />
    }

    return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node
}

export default ProtectedRoute