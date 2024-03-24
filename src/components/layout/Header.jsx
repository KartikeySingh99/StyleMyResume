import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import authService from "../../appwrite/appwriteConfig";
import MenuIcon from '@mui/icons-material/Menu';
import MobileMenu from "./MobileMenu";

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isAuthenticated } = useSelector((state) => state.authStatus);

    const [backgroundColor, setBackgroundColor] = useState("bg-primary");
    const [showMenu, setShowMenu] = useState(false);
    // const [openMenu, setOpenMenu] = useState(false);

    const handleLogout = () => {
        authService.logout()
            .then(() => dispatch(logout()))
            .catch((error) => console.log(error))
    }

    const menuItems = [
        {
            name: "Templates",
            path: "/template"
        },
        {
            name: "About",
            path: "/about"
        },
        {
            name: "Sign Up",
            path: "/singup"
        },
        {
            name: "Login",
            path: "/login"
        },
    ]

    const handleScroll = () => {
        if(window.scrollY >=100){
            setBackgroundColor('bg-primary')
        }
        else{
            setBackgroundColor('bg-none')
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    }, [])

    return (
        <>
            <header className={`fixed top-0 z-20 w-full bg-primary/70 backdrop-blur-lg shadow-md`}>
                <nav className='flex items-center justify-around'>
                    <Link to="/" ><h1 className='text-white text-2xl lg:text-4xl font-extrabold font-heading'>StyleMyResume</h1></Link>
                    <ul className="hidden font-semibold lg:flex items-center justify-around text-white text-lg">
                        {/* {
                            menuItems.map((item, i) => (
                                <li key={i} className='p-4 hover:cursor-pointer' onClick={() => navigate(item.path)}>{item.name}</li>
                            ))
                        } */}
                        <Link to="/template"><li className='p-4 hover:cursor-pointer'>Templates</li></Link>
                        <li className='p-4 hover:cursor-pointer'>About Us</li>
                        {/* {
                            !isAuthenticated ?
                                <>
                                    <Link to="/signup"><li className='p-4 hover:cursor-pointer'>Sign-In</li></Link>
                                    <Link to="/login"><li className='p-4 hover:cursor-pointer'>Login</li></Link>
                                </>
                                :
                                <button onClick={handleLogout}>Logout</button>
                        } */}
                    </ul>
                    <div className="block  text-white font-semibold py-2">
                        <div className="block  hover:cursor-pointer hover:scale-105" onClick={() => setShowMenu(!showMenu)}><MenuIcon fontSize="large" /></div>
                    </div>
                </nav>
            </header>
            <MobileMenu openMenu={showMenu} setOpenMenu={setShowMenu} logout={handleLogout} />
        </>
    )
}

export default Header