import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {


    const { isAuthenticated, loading } = useSelector((state) => state.authStatus);

    if (!isAuthenticated && !loading) {
        return <Navigate to="/login" />
    }

    return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
    children: PropTypes.node
}

export default ProtectedRoute