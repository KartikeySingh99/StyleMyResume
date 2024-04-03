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

    const { isAuthenticated, error } = useSelector((state) => state.authStatus);

    useEffect(() => {
        if (error) {
            toast.error(error, { autoClose: 2000 })
        }
        if (isAuthenticated) {
            toast.success("Log In Successfull!", { autoClose: 1000 })
            navigate('/');
        }
    }, [isAuthenticated, error])

    const handleFormData = (data) => {
        const { email, password } = data;
        authService.login({ email, password })
            .then((data) => {
                dispatch(LoginAction(data));
                dispatch(fetchUserData(data));
            })
            .catch((err) => toast.error(err.message + "error wala", { autoClose: 1000, position: 'bottom' }))
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