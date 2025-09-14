import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import { inputRules, type InputTypes } from "../../../config/input-rules";
import { isEmail } from "../../../utils";
import { type APIError, type SignInForm } from "../../../types";
import { Btn } from "../../ui/btn";
import { FormError } from "../../ui/form-error/form-error";
import { Loader } from "../../ui/loader/loader";
import { PATHS } from "../../../app/routes";
import { useSignInMutation } from "../current-user-slice";

import "../../ui/btn/btn.scss";
import "../../ui/text-input/text-input.scss";
import "../../ui/form/form.scss";

export function SignInForm(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const navigate = useNavigate();
  const [
    signIn,
    {
      isError: isSignInError,
      isLoading: isSignInLoading,
      isSuccess: isSignInSuccess,
      error: signInError,
    },
  ] = useSignInMutation();
  React.useEffect(() => {
    if (isSignInSuccess) navigate(PATHS.root);
  }, [isSignInSuccess, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
  } = useForm<InputTypes>({ mode: "onBlur" });
  React.useEffect(() => {
    if (isSignInError) {
      setError("password", {
        type: "string",
        message: (signInError as APIError).message,
      });
    }
  }, [isSignInError, signInError, setError]);

  async function handleSignIn({ emailOrUsername, password }: SignInForm) {
    clearErrors();

    if (isEmail(emailOrUsername)) {
      signIn({ email: emailOrUsername, password });
    } else {
      signIn({ username: emailOrUsername, password });
    }
  }

  return isSignInLoading ? (
    <Loader color="pink" />
  ) : (
    <form
      className={`form ${props.className || ""}`}
      onSubmit={handleSubmit(handleSignIn, (errors: unknown) =>
        console.error(errors)
      )}
      onChange={() => clearErrors()}
    >
      <div className="form__form-group">
        <label className="form__label" htmlFor="emailorusername">
          <input
            className="form__input text-input"
            type="emailorusername"
            id="emailorusername"
            placeholder="Email or username"
            {...register("emailOrUsername", inputRules.signInEmailOrUsername)}
          />
        </label>
        {errors.emailOrUsername && (
          <FormError>{errors.emailOrUsername.message}</FormError>
        )}
      </div>

      <div className="form__form-group">
        <label className="form__label" htmlFor="password">
          <input
            className="form__input text-input"
            type="password"
            id="password"
            placeholder="Password"
            {...register("password", inputRules.signInPassword)}
          />
        </label>
        {errors.password && <FormError>{errors.password.message}</FormError>}
      </div>

      <Btn name="Log In" theme="white" isLoading={isSignInLoading}>
        <Loader color="black" for="btn" />
      </Btn>

      <p>
        <NavLink to="/forgot-pass" className="link">
          Forgot Password?
        </NavLink>
      </p>
    </form>
  );
}
