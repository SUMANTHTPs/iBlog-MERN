import React, { useContext, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { AiOutlineLogout} from 'react-icons/ai';

const Navbar = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:4000/auth/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, [setUserInfo]);

  const clearCookie = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  const logout = async () => {
    clearCookie();
    // await fetch("http://localhost:4000/logout", {
    //   credentials: "include",
    //   method: "POST",
    // });
    setUserInfo(null);
    navigate('/login');
  };
  
  const username = userInfo?.username;
  return (
    <div>
      <div className="nav-container">
        <div>
          <img
            className="nav-logo"
            src={logo}
            alt="branding"
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <div>
          {username ? (
            <>
              <Link className="register-links" to="/">
                {username}
              </Link>
              <button style={{border:'none'}} className="register-links" onClick={logout}>
                <AiOutlineLogout />
              </button>
            </>
          ) : (
            <>
              <Link className="register-links" to="/login">
                Login
              </Link>
              <Link className="register-links" to="/signup">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
