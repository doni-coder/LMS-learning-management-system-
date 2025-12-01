import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPages({ children }) {
  const isLoggedIn = true;
  const navigate = useNavigate();
  console.log(isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  }, []);

  return <div>{children}</div>;
}

export default ProtectedPages;
