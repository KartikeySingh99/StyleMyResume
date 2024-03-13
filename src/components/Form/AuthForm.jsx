import TextField from '@mui/material/TextField';
import { useForm, Controller } from "react-hook-form";
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PropTypes from "prop-types";

const AuthForm = ({ onSubmit, formHeading, type }) => {

    const { control, handleSubmit, formState: { errors } } = useForm();

    const fields = [
        {
            field: <Controller
                name='name'
                control={control}
                rules={{
                    required: "Please Fill Your Name",
                }}
                render={({ field }) =>
                    <TextField
                        className='w-72'
                        {...field}
                        error={errors.name}
                        helperText={errors.name ? errors.name.message : ''}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccountCircleIcon fontSize='small' />
                                </InputAdornment>)
                        }}
                        type='text'
                        placeholder='Enter Your Name'
                        label="Name"
                        variant='standard'
                        margin='dense' />}
            />,
            status: type === "signup" ? 'active' : 'inactive'
        },
        {
            field: <Controller
                name='email'
                control={control}
                rules={{
                    required: "Please fill Email ID",
                    pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Incorrect Email ID"
                    }
                }}
                render={({ field }) =>
                    <TextField
                        className='w-72'
                        {...field}
                        error={errors.email}
                        helperText={errors.email ? errors.email.message : ''}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EmailIcon fontSize='small' />
                                </InputAdornment>
                            )
                        }}
                        type='email'
                        placeholder='Enter Your Email'
                        label="Email ID"
                        variant='standard'
                        margin='dense' />}
            />,
            status: 'active',
        },
        {
            field: <Controller
                name='password'
                control={control}
                rules={{
                    required: "Please Create A Password",
                    minLength: { value: 6, message: "Password Length Must Be Greater Than 6" }
                }}
                render={({ field }) =>
                    <TextField
                        className='w-72'
                        {...field}
                        error={errors.password}
                        helperText={errors.password ? errors.password.message : ''}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <VpnKeyIcon fontSize='small' />
                                </InputAdornment>
                            )
                        }}
                        type='password'
                        placeholder='Enter Your Password'
                        label="Password"
                        variant='standard'
                        margin='dense' />}
            />,
            status: 'active'
        }
    ]

    return (
        <div className='text-center'>
            <h1 className="text-primary text-3xl font-extrabold font-heading">{formHeading}</h1>

            <form onSubmit={handleSubmit(onSubmit)} className='my-4 flex flex-col items-center justify-center gap-y-4 w-full '>
                {
                    fields.map((item) => (
                        item.status === "active" &&
                        item.field
                    ))
                }
                <button className='bg-primary text-white px-8 py-2 rounded-full text-center mt-6 font-bold' type='submit'>{formHeading}</button>

            </form>
        </div>
    )
}
AuthForm.propTypes = {
    onSubmit: PropTypes.func,
    formHeading: PropTypes.string,
    type: PropTypes.string
}
export default AuthForm