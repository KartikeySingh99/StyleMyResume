import { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "./components/layout/Header";
import Home from "./pages/Home/Home";
import authService from "./appwrite/appwriteConfig";
import { logout, Login as login, getUser } from "./slices/authSlice";
import { fetchUserData } from "./slices/userSlice";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./components/Loader/Loader";
import "./App.css";

const Login = lazy(() => import("./pages/Login/Login"));
const SignUp = lazy(() => import("./pages/Login/SignUp"));
const DetailsPage = lazy(() => import("./pages/Details/DetailsPage"));
const EditDetails = lazy(() => import("./pages/Details/EditDetails"));
const Profile = lazy(() => import("./pages/User/Profile"));
const TemplatePage = lazy(() => import("./pages/Templates/TemplatePage"));
const Template1WithLogic = lazy(() => import("./pages/Templates/Template1"));
const Template2WithLogic = lazy(() => import("./pages/Templates/Template2"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((data) => {
        if (data.error) {
          // console.log(data);
          dispatch(logout());
        } else {
          // console.log("userData App.js=>", data);
          dispatch(getUser(data)); //* passing current user data
          dispatch(login(data));
          dispatch(fetchUserData(data));
        }
      })
      .catch((err) => console.log(err));
  }, [dispatch]);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
      <Header />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route exact path="/templates" element={<TemplatePage />} />
          <Route
            exact
            path="/template1"
            element={
              <ProtectedRoute>
                <Template1WithLogic />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/template2"
            element={
              <ProtectedRoute>
                <Template2WithLogic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/details"
            element={
              <ProtectedRoute>
                <DetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit"
            element={
              <ProtectedRoute>
                <EditDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
