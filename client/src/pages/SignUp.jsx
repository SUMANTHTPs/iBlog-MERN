import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (ev) => {
    ev.preventDefault();
    await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
  };

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
      <form className="login-form" onSubmit={register}>
        <h2 className="login-txt">Register</h2>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your awesome name"
          autoFocus={true}
          value={username}
          onChange={(ev)=> setUsername(ev.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter the Email"
          value={email}
          onChange={(ev)=> setEmail(ev.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter the password"
          value={password}
          onChange={ev=> setPassword(ev.target.value)}
          required
        />
        <div className="footer">
          <button className="login-btn">Register</button>
          <Link to="/login">Login &#187;</Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
