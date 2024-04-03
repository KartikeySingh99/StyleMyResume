import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import TextField from '@mui/material/TextField';
// import { useForm, Controller } from "react-hook-form";
import authService from '../../appwrite/appwriteConfig';
import { register } from '../../slices/authSlice';
import { useEffect } from 'react';
import AuthForm from '../Form/AuthForm';
import { toast } from "react-toastify";
export const SignUp = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isCreated } = useSelector((state) => state.authStatus)
    // const { control, handleSubmit, formState: { errors } } = useForm();

    useEffect(() => {
        if (isCreated) {
            toast.success("Account created!", { autoClose: 1000 });
            navigate('/')
        }
    }, [isCreated])

    const handleFormData = (data) => {
        const { email, password, name } = data;
        authService.createAccount({ email, password, name })
            .then((data) => dispatch(register(data)))
            .catch((err) => console.log(err))
    }
    return (
        <AuthForm formHeading="Sign Up" onSubmit={handleFormData} type="signup" />
    )
}
