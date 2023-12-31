import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  function setToken(value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      "token" +
      "=" +
      encodeURIComponent(value) +
      ";expires=" +
      expires.toUTCString() +
      ";path=/";
  }

  const login = async (ev) => {
    ev.preventDefault();
    setIsLoading(true);
    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setIsLoading(false);

    if (response.ok) {
      const data = await response.json();
      navigate("/");
      const token = data.token;
      setToken(token, 1);
    } else {
      alert("Wrong credentials");
    }
  };

  if(isLoading) {
    return <Spinner/>
  }

  return (
    <div>
      <img
        className="login-brand"
        src={logo}
        alt="brand-logo"
        onClick={() => {
          navigate("/");
        }}
      />
      <form className="login-form" onSubmit={login}>
        <h2 className="login-txt">Login</h2>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter the Email"
          autoFocus
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter the password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required
        />
        <div className="footer">
          <button className="login-btn">Login</button>
          <Link to="/signup">Register &#187;</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
