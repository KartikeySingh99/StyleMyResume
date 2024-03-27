import './App.css';
import Header from './components/layout/Header';
import Home from './pages/Home/Home';
import Demo from './pages/Templates/Demo';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login/Login';
import SignUp from './pages/Login/SignUp';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import authService from "./appwrite/appwriteConfig";
import { logout, Login as login, getUser } from './slices/authSlice';
import { fetchUserData } from './slices/userSlice';
import DetailsPage from './pages/Details/DetailsPage';
import EditDetails from './pages/Details/EditDetails';
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import TemplatePage from './pages/Templates/TemplatePage';
import Profile from './pages/User/Profile';
import Template1 from './pages/Templates/Template1';

function App() {

  const dispatch = useDispatch()

  const { isAuthenticated, userData } = useSelector((state) => state.authStatus);

  const { user } = useSelector((state) => state.user);

  // console.log(isAuthenticated);
  // console.log(userData);
  // console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      console.log("app call");
      try {
        const data = await authService.getCurrentUser();
        if (data) {
          console.log(data);
          dispatch(getUser(data));
          dispatch(login(data));
          dispatch(fetchUserData(data));
        } else {
          dispatch(logout());
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    // authService.getCurrentUser()
    //   .then((data) => {
    //     if (data) {
    //       // console.log("userData App.js=>",data);
    //       dispatch(getUser(data))
    //       dispatch(login(data))
    //       dispatch(fetchUserData(data))
    //     }
    //     else {
    //       dispatch(logout())
    //     }
    //   })
    //   .catch((err) => console.log(err))
  }, [dispatch])

  return (
    <>
      <Header />
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route exact path='/template' element={
          <ProtectedRoute>
            <TemplatePage />
          </ProtectedRoute>
        } />
        <Route exact path='/template1' element={
          <ProtectedRoute>
            <Demo/>
          </ProtectedRoute>
        } />
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path='/details' element={
          <ProtectedRoute>
            <DetailsPage />
          </ProtectedRoute>
        } />
        <Route path='/edit' element={
          <ProtectedRoute>
            <EditDetails />
          </ProtectedRoute>
        } />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
      </Routes>
    </>
  )
}

export default App
