import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const MobileMenu = ({ openMenu, setOpenMenu, logout }) => {

    const { isAuthenticated } = useSelector((state) => state.authStatus);

    const navigate = useNavigate();

    const menuOptions = [
        {
            name: "Your Profile",
            slug: "/profile",
            isAuthenticated: true
        },
        {
            name: "Templates",
            slug: "/template",
            isAuthenticated: true
        },
        {
            name: "Ananlyze Resume",
            slug: "/generate-suggestion",
            isAuthenticated: true
        },
        {
            name: "About Us",
            slug: "/about",
            isAuthenticated: false
        },
        {
            name: "Logout",
            isAuthenticated: true,
            // func: logout()
        },
        {
            name: "Login",
            slug: "/login",
            isAuthenticated: false
        },
        {
            name: "Signup",
            slug: "/signup",
            isAuthenticated: false
        },
    ]


    const list = () => (
        <Box
            role="presentation"
            width={300}
            paddingTop={2}
        // onClick={toggleDrawer(anchor, false)}
        // onKeyDown={toggleDrawer(anchor, false)}
        >
            <h1 className='text-xl font-bold w-full text-center'>Menu</h1>
            <div className='w-full absolute top-0 px-2 hover:cursor-pointer group ' onClick={() => setOpenMenu(false)}>
                <CloseIcon fontSize='medium' className='group-hover:scale-110' />
            </div>
            <ul className='text-slate-500 mt-6 divide-y-2'>
                {/* {
                    menuOptions.map((option, index) => (
                        (option.isAuthenticated && isAuthenticated) ?
                            <li key={index} className='hover:cursor-pointer hover:bg-gray-100 py-3 px-4' onClick={() => { setOpenMenu(false); option.slug && navigate(option.slug) }}>
                                <p className=' text-md font-semibold'>{option.name}</p>
                            </li>
                            :
                            (!isAuthenticated && option.isAuthenticated === false) &&
                            <li key={index} className='hover:cursor-pointer hover:bg-gray-100 py-3 px-4' onClick={() => { setOpenMenu(false); option.slug && navigate(option.slug) }}>
                                <p className=' text-md font-semibold'>{option.name}</p>
                            </li>

                    ))
                } */}
                <li className='hover:cursor-pointer hover:bg-gray-100 py-3 px-4' onClick={() => { setOpenMenu(false); navigate("/profile") }}>
                    <p className=' text-md font-semibold'>Your Profile</p>
                </li>
                <li className='hover:cursor-pointer hover:bg-gray-100 py-3 px-4' onClick={() => { setOpenMenu(false); navigate("/template") }}>
                    <p className=' text-md font-semibold'>Templates</p>
                </li>
                <li className='hover:cursor-pointer hover:bg-gray-100 py-3 px-4 ' onClick={() => { setOpenMenu(false); navigate("/aboutus") }}>
                    <p className='text-md font-semibold'>About Us</p>
                </li>
                {
                    isAuthenticated ?
                        <li className='hover:cursor-pointer hover:bg-gray-100 py-3 px-4' onClick={() => { setOpenMenu(false); logout() }}>
                            <p className='text-md font-semibold'>Logout</p>
                        </li>
                        :
                        <li className='hover:cursor-pointer hover:bg-gray-100 py-3 px-4' onClick={() => { setOpenMenu(false); navigate("/login") }}>
                            <p className='text-md font-semibold'>Login</p>
                        </li>
                }
                {
                    !isAuthenticated &&
                    <li className='hover:cursor-pointer hover:bg-gray-100 py-3 px-4' onClick={() => { setOpenMenu(false); navigate("/signup") }}>
                        <p className='text-md font-semibold'>SignUp</p>
                    </li>
                }
            </ul>
        </Box>
    );

    return (
        <div>
            <Drawer
                anchor={'right'}
                open={openMenu}
                transitionDuration={300}
                onClose={() => setOpenMenu(false)}
            >
                {list()}
            </Drawer>
        </div>
    )
}

export default MobileMenu