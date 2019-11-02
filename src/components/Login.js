import React, { useState } from "react";
import { Link } from "react-router-dom";
import history from "../history";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);

  const handleInputChange = event => {
    const { value, name } = event.target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const onSubmit = event => {
    event.preventDefault();
    fetch("https://floating-woodland-24825.herokuapp.com/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 200) {
          console.log(res);
          history.push("/");
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error logging in please try again");
      });
  };

  return (
    <div>
      <div className="App-header">
        <Link to="/">
          <h1>My Blog</h1>
        </Link>
        <div className="navigation">
          <Link to="/" className="btn">
            Home
          </Link>
        </div>
      </div>
      <div className="main-content">
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
          <input className="btn-primary" type="submit" value="Submit" />
        </form>
      </div>
      <div className="auth-navigation">
        <span>Not yet registered?</span>
        <Link to="/register" className="btn">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
