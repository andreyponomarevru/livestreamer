import * as React from "react";
import { Link } from "react-router-dom";

import { useLocation } from "react-router";
import { Box } from "../../ui/box/box";
import { SignInForm } from "./signin-form-component";
import { RegisterForm } from "./register-form-component";

import "./../../ui/box/box.scss";

function AuthBox() {
  const location = useLocation();

  const activeSignInClassName =
    location.pathname === "/signin" ? "box__header-link_active" : "";

  const activeSignUpClassName =
    location.pathname === "/register" ? "box__header-link_active" : "";

  return (
    <Box className="auth-box">
      <header className="box__header">
        <Link
          to="/signin"
          className={`box__header-link ${activeSignInClassName}`}
        >
          Login
        </Link>
        <Link
          to="/register"
          className={`box__header-link ${activeSignUpClassName}`}
        >
          Join
        </Link>
      </header>
      {location.pathname === "/signin" ? <SignInForm /> : <RegisterForm />}
    </Box>
  );
}

export { AuthBox };
