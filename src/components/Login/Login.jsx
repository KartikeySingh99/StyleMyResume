import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../../appwrite/appwriteConfig';
import { Login as LoginAction } from '../../slices/authSlice';
import { fetchUserData } from '../../slices/userSlice';
import AuthForm from '../Form/AuthForm';


export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.authStatus);

    useEffect(() => {
        if (isAuthenticated) {
            // dispatch(fetchUserData());
            navigate('/');
        }
    }, [isAuthenticated])

    const handleFormData = (data) => {
        const { email, password } = data;
        authService.login({ email, password })
            .then((data) => { dispatch(LoginAction(data)); dispatch(fetchUserData(data.userId)) })
            .catch((err) => console.log(err))
    }

    return (
        <AuthForm formHeading="Login" onSubmit={handleFormData} type="login" />
    )
}