import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const MobileMenu = ({ openMenu, setOpenMenu, logout }) => {
  const { isAuthenticated } = useSelector((state) => state.authStatus);
  const { user, error } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const menuOptions = [
    {
      name: "Your Profile",
      slug: "/profile",
      isAuthReq: true,
      authRoute: false,
    },
    {
      name: "Templates",
      slug: "/templates",
      isAuthReq: false,
      authRoute: false,
    },
    // {
    //     name: "Ananlyze Resume",
    //     slug: "/generate-suggestion",
    //     isAuthenticated: true
    // },
    {
      name: "About Us",
      slug: "/about",
      isAuthReq: false,
      authRoute: false,
    },
    // {
    //   name: "Logout",
    //   isAuthReq: true,
    //   authRoute: false,
    // },
    {
      name: "Login",
      slug: "/login",
      isAuthReq: false,
      authRoute: true,
    },
    {
      name: "Signup",
      slug: "/signup",
      isAuthReq: false,
      authRoute: true,
    },
  ];

  const checkProfile = () => {
    if (isAuthenticated && Object.entries(user).length > 0) {
      setOpenMenu(false);
      setOpenMenu(false);
      navigate("/profile");
    } else {
      toast.error(error, { autoclose: 1000 });
      setOpenMenu(false);
    }
  };

  const list = () => (
    <Box
      role="presentation"
      width={300}
      paddingTop={2}
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <h1 className="text-xl font-bold w-full text-center">Menu</h1>
      <div
        className="w-full absolute top-0 px-2 hover:cursor-pointer group "
        onClick={() => setOpenMenu(false)}
      >
        <CloseIcon fontSize="medium" className="group-hover:scale-110" />
      </div>
      <ul className="text-slate-500 mt-6 divide-y-2">
        {menuOptions.map((option, index) => (
          <>
            {option.isAuthReq && isAuthenticated && (
              <li
                // key={index}
                className="hover:cursor-pointer hover:bg-gray-100 py-3 px-4"
                onClick={() => {
                  setOpenMenu(false);
                  option.slug && navigate(option.slug);
                }}
              >
                <p className=" text-md font-semibold">{option.name}</p>
              </li>
            )}
            {!option.isAuthReq && !option.authRoute && (
              <li
                //   key={index}
                className="hover:cursor-pointer hover:bg-gray-100 py-3 px-4"
                onClick={() => {
                  setOpenMenu(false);
                  option.slug && navigate(option.slug);
                }}
              >
                <p className=" text-md font-semibold">{option.name}</p>
              </li>
            )}
            {option.authRoute && !isAuthenticated && (
              <li
                //   key={index}
                className="hover:cursor-pointer hover:bg-gray-100 py-3 px-4"
                onClick={() => {
                  setOpenMenu(false);
                  option.slug && navigate(option.slug);
                }}
              >
                <p className=" text-md font-semibold">{option.name}</p>
              </li>
            )}
          </>
        ))}
        {isAuthenticated && (
          <li
            className="hover:cursor-pointer hover:bg-gray-100 py-3 px-4"
            onClick={() => {
              setOpenMenu(false);
              logout();
            }}
          >
            <p className="text-md font-semibold">Logout</p>
          </li>
        )}
      </ul>
    </Box>
  );

  return (
    <div>
      <Drawer
        anchor={"right"}
        open={openMenu}
        transitionDuration={300}
        onClose={() => setOpenMenu(false)}
      >
        {list()}
      </Drawer>
    </div>
  );
};

export default MobileMenu;
