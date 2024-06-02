import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../slices/authSlice";
import authService from "../../appwrite/appwriteConfig";
import MenuIcon from "@mui/icons-material/Menu";
import MobileMenu from "./MobileMenu";
import { toast } from "react-toastify";
import { resetUser } from "../../slices/userSlice";
import navbarContext from "./navbarContext";

const Header = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navbarRef = useRef(null);

  const { isAuthenticated, error } = useSelector((state) => state.authStatus);

  const [backgroundColor, setBackgroundColor] = useState("bg-primary");
  const [showMenu, setShowMenu] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error, { autoClose: 1000 });
    }
  }, [error]);

  useEffect(() => {
    if (navbarRef.current) {
      const height = navbarRef.current.offsetHeight;
    //   console.log(height);
      setNavbarHeight(height);
    }
  }, []);

  const handleLogout = () => {
    authService
      .logout()
      .then(() => {
        dispatch(logout());
        dispatch(resetUser());
      })
      .catch((error) => console.log(error.code));
  };

  const menuItems = [
    {
      name: "Templates",
      path: "/templates",
      isAuthReq: false,
    },
    {
      name: "About",
      path: "/about",
      isAuthReq: false,
    },
    // {
    //   name: "Sign Up",
    //   path: "/signup",
    //   isAuthReq: false,
    // },
    // {
    //   name: "Login",
    //   path: "/login",
    //   isAuthReq: false,
    // },
  ];

  const handleScroll = () => {
    if (window.scrollY >= 100) {
      setBackgroundColor("bg-primary");
    } else {
      setBackgroundColor("bg-none");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <navbarContext.Provider value={navbarHeight}>
        <header
          ref={navbarRef}
          className={`fixed top-0 z-20 w-full bg-primary/70 backdrop-blur-lg shadow-md`}
        >
          <nav className="flex items-center justify-around">
            <Link to="/">
              <h1 className="text-white text-2xl lg:text-4xl font-extrabold font-heading">
                StyleMyResume
              </h1>
            </Link>
            <ul className="hidden font-semibold lg:flex items-center justify-around text-white text-lg">
              {
                            menuItems.map((item, i) => (
                                <li key={i} className='p-4 hover:cursor-pointer' onClick={() => navigate(item.path)}>{item.name}</li>
                            ))
                        }
              {/* <Link to="/templates">
                <li className="p-4 hover:cursor-pointer">Templates</li>
              </Link>
              <li className="p-4 hover:cursor-pointer">About Us</li> */}
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
              <div
                className="block  hover:cursor-pointer hover:scale-105"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MenuIcon fontSize="large" />
              </div>
            </div>
          </nav>
        </header>
        <MobileMenu
          openMenu={showMenu}
          setOpenMenu={setShowMenu}
          logout={handleLogout}
        />
        {children}
      </navbarContext.Provider>
    </>
  );
};

export default Header;
