import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import TextField from '@mui/material/TextField';
// import { useForm, Controller } from "react-hook-form";
import authService from '../../appwrite/appwriteConfig';
import { register } from '../../slices/authSlice';
import { useEffect } from 'react';
import AuthForm from '../Form/AuthForm';

export const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isCreated } = useSelector((state) => state.authStatus)
    // const { control, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (isCreated) {
            alert("Account created!");
            navigate('/')
        }
    }, [isCreated])

    const handleFormData = (data) => {
        const { email, password, name } = data;
        authService.createAccount({ email, password, name })
            .then(() => dispatch(register()))
            .catch((err) => console.log(err))
    }
    return (
        <AuthForm formHeading="Sign Up" onSubmit={handleFormData} type="signup" />
    )
}
