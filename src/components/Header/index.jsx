import React, { useEffect } from "react";
import "./styles.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";

const Header = () => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFnc() {
    signOut(auth)
      .then(() => {
        toast.success("Logged Out Successfully!");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }
  return (
    <div className="navbar">
      <p className="logo">QuantifyMe.</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Avatar
            src={user.photoURL}
            icon={<UserOutlined />} // shown when photoURL is null
            size={40}
          />
          <p className="logo link" onClick={logoutFnc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
};

export default Header;
