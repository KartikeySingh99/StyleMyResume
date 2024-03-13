import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import authService from '../../appwrite/appwriteConfig';
import { Login as LoginAction } from '../../slices/authSlice';
import { fetchUserData } from '../../slices/userSlice';
import AuthForm from '../Form/AuthForm';
import { toast } from "react-toastify";


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
            .catch((err) => toast.error(err.message, { autoClose: 1000, position: 'top-right' }))
    }

    return (
        <>
            <div className='flex items-center justify-center flex-col'>
                <AuthForm formHeading="Login" onSubmit={handleFormData} type="login" />
                <p className='text-md'>Don't have account? <span className='text-blue-500 hover:cursor-pointer font-semibold' onClick={() => navigate('/signup')}>Register</span> here</p>
            </div>
        </>

    )
}