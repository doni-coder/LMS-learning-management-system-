import React from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoCart } from "react-icons/io5";
import axios from "axios";
axios.defaults.withCredentials = true;

const Navbar = ({ isLoggedIn = false, user }) => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems);

  function CheckUserRole() {
    if (user?.user_role === "student") {
      navigate("/student-dashboard");
    } else if (user?.user_role === "instructor") {
      navigate("/instructor-dashboard");
    }
  }

  console.log("user:", user?.profile_pic);

  const handleLogout = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/auth/logout`
    );
    if (response.status === 200) {
      console.log("Logout successful");
      navigate("/");
      window.location.reload();
    } else {
      console.error("Logout failed");
    }
  };

  return (
    <nav className="fixed w-full z-[99] border-b border-white/20 backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 shadow-lg text-black py-[17px]">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="md:w-[120px] w-[100px]">
          <Link to="/">
            <img
              className="w-full"
              src="https://freelogopng.com/images/all_img/1683006915udemy-logo-white.png"
              alt=""
            />
          </Link>
        </div>

        {/* Right Links */}
        <div className="space-x-5 flex items-center">
          <Link to="/explore" className="hover:text-gray-300">
            Explore
          </Link>
          {user?.user_role === "student" ? (
            <Link to={"/cart"}>
              <div className="relative">
                <div className="w-3.5 text-center text-white text-[9px] h-3.5 rounded-full absolute top-[-5px] bg-black">
                  {cartItems.length}
                </div>
                <IoCart size={25} />
              </div>
            </Link>
          ) : null}
          {isLoggedIn ? (
            <div>
              <Dialog>
                <DialogTrigger asChild className="text-white  cursor-pointer">
                  <div
                    style={{
                      backgroundImage: `url(${user?.profile_pic})`,
                    }}
                    className="md:w-[45px] md:h-[45px] bg-cover bg-center w-[40px] h-[40px] rounded-full"
                  ></div>
                </DialogTrigger>
                <DialogContent className={"[&>button]:text-white"}>
                  <DialogHeader>
                    <DialogTitle>Your profile</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3">
                    <div>
                      <div>
                        <h2 className="inline-block font-bold">Name:</h2>{" "}
                        <span className="text-gray-400 text-sm">
                          {user?.name}
                        </span>
                      </div>
                      <div>
                        <h2 className="inline-block font-bold">Email:</h2>{" "}
                        <span className="text-gray-400 text-sm">
                          {user?.email}
                        </span>
                      </div>
                      <div>
                        <h2 className="inline-block font-bold">Role:</h2>{" "}
                        <span className="text-gray-400 text-sm">
                          {user?.user_role}
                        </span>
                      </div>
                    </div>
                    <DialogClose asChild>
                      <button
                        style={{
                          backgroundColor: "#646cff",
                          outline: "none",
                          padding: "8px 20px",
                        }}
                        className="text-white"
                        onClick={() => {
                          CheckUserRole();
                        }}
                      >
                        Dashboard
                      </button>
                    </DialogClose>
                    <DialogClose asChild>
                      {user?.user_role === "student" ? (
                        <button
                          style={{
                            backgroundColor: "black",
                            outline: "none",
                            padding: "8px 20px",
                          }}
                          className="text-white"
                          onClick={() => {
                            navigate("/edit-student-detail");
                          }}
                        >
                          Edit detail
                        </button>
                      ) : (
                        <button
                          style={{
                            backgroundColor: "black",
                            border: "solid 1px white",
                            padding: "8px 20px",
                          }}
                          className="text-white border-4 border-b-gray-400"
                          onClick={() => {
                            navigate("/edit-instructor-detail");
                          }}
                        >
                          Edit detail
                        </button>
                      )}
                    </DialogClose>
                    <DialogClose asChild>
                      <div className="w-full flex justify-end">
                        <button
                          style={{
                            backgroundColor: "black",
                            outline: "none",
                            padding: "8px 20px",
                          }}
                          className="text-white text-3xl w-[100px] flex justify-center"
                          onClick={() => {
                            handleLogout();
                          }}
                        >
                          ⏻
                        </button>
                      </div>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Link
              to={"/login"}
              // style={{
              //   background: "linear-gradient(135deg, black, black)",
              //   boxShadow: "0 0 4px #0c47f7",
              // }}
              className="bg-white text-sm text-black px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
