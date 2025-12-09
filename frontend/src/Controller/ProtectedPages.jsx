import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedPages({ children }) {
  const isLoggedIn = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  }, []);

  return <div>{children}</div>;
}

export default ProtectedPages;
