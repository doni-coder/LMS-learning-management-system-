import React, { useEffect } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Route, Routes, useLocation } from "react-router-dom";
import Explore from "./pages/Explore";
import ProtectedPages from "./Controller/ProtectedPages";
import Student from "./pages/student/Student";
import CourseDetail from "./pages/CourseDetail";
import Cart from "./pages/student/Cart";
import SelectRole from "./pages/SelectRole";
import CourseContent from "./pages/student/CourseContent";
import Instructor from "./pages/instructor/Instructor";
import DraftCourse from "./pages/instructor/DraftCourse";
import EditDraftCourse from "./pages/instructor/EditDraftCourse";
import StudentInfo from "./pages/student/StudentInfo";
import InstructorDetails from "./pages/instructor/InstructorDetails";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useDispatch } from "react-redux";
import { login, setUserRole } from "./reduxStore/userSlice";
import { setLocalStorageCartItems } from "./reduxStore/cartSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CheckOut from "./pages/student/PaymentSuccess";
import PaymentSuccess from "./pages/student/PaymentSuccess";
import PaymentCancel from "./pages/student/PaymentCancel";
import StreamPage from "./pages/student/StreamPage";
import InstructorLivePage from "./pages/instructor/InstructorLivePage";
import EnterOtp from "./pages/EnterOtp";
import ResetPassword from "./pages/ResetPassword";
import NoticePopup from "./components/NoticePopup";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axios
          .get(`${import.meta.env.VITE_API_URL}/auth/current-user`, {
            withCredentials: true,
          })
          .then(async (response) => {
            dispatch(login(response.data.user));
            dispatch(setUserRole(response.data.user.user_role));
            console.log("STUDENT ID", response.data.user?.id);
          });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    if (!user?.id) return;
    const getCartItem = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_URL}/api/student/cart-items`)
        .then((response) => {
          console.log("cartItem:", response);
          dispatch(setLocalStorageCartItems(response.data?.cart));
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getCartItem();

    return () => getCartItem;
  }, [dispatch, user?.id]);

  return (
    <div className="dark:bg-gray-900">
      <NoticePopup />
      <Navbar isLoggedIn={isLoggedIn} user={user} />
      <div className="pt-[70px]">
        <Routes key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/enter-otp" element={<EnterOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/student-dashboard"
            element={
              <ProtectedPages>
                <Student />
              </ProtectedPages>
            }
          />
          <Route
            path="/instructor-dashboard"
            element={
              <ProtectedPages>
                <Instructor />
              </ProtectedPages>
            }
          />
          <Route path="/course-detail/:courseId" element={<CourseDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/select-userRole" element={<SelectRole />} />
          <Route
            path="/course-content/:courseId"
            element={
              <ProtectedPages>
                <CourseContent />
              </ProtectedPages>
            }
          />
          <Route
            path="/edit-course/:id"
            element={
              <ProtectedPages>
                <EditDraftCourse />
              </ProtectedPages>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedPages>
                <PaymentSuccess />
              </ProtectedPages>
            }
          />
          <Route
            path="/payment-cancel"
            element={
              <ProtectedPages>
                <PaymentCancel />
              </ProtectedPages>
            }
          />
          <Route
            path="/live-class/:id"
            element={
              <ProtectedPages>
                <StreamPage />
              </ProtectedPages>
            }
          />
          <Route
            path="/start-live/:courseId"
            element={
              <ProtectedPages>
                <InstructorLivePage />
              </ProtectedPages>
            }
          />
          <Route path="/edit-student-detail" element={<StudentInfo />} />
          <Route
            path="/edit-instructor-detail"
            element={<InstructorDetails />}
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
