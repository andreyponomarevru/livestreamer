import React from "react";
import { NavLink, useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import { inputRules, type InputTypes } from "../../../../../config/input-rules";
import { isEmail } from "../../../../../utils";
import { type APIError, type SignInForm } from "../../../../../types";
import { Btn } from "../../../../ui/btn";
import { FormError } from "../../../../ui/form-error/form-error-component";
import { Loader } from "../../../../ui/loader/loader-component";
import { PATHS } from "../../../../../config/constants";
import { useSignInMutation } from "../../../current-user-slice";

export function SignInForm(
  props: React.HTMLAttributes<HTMLDivElement>,
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
    <Loader />
  ) : (
    <form
      className={`form form_layout_col ${props.className || ""}`}
      onSubmit={handleSubmit(handleSignIn, (errors: unknown) =>
        console.error(errors),
      )}
      onChange={() => clearErrors()}
    >
      <div>
        <label className="form__label" htmlFor="emailorusername"></label>
        <input
          className="text-input"
          type="emailorusername"
          id="emailorusername"
          placeholder="Email or username"
          {...register("emailOrUsername", inputRules.signInEmailOrUsername)}
        />
        {errors.emailOrUsername && (
          <FormError>{errors.emailOrUsername.message}</FormError>
        )}
      </div>

      <div>
        <label className="form__label" htmlFor="password"></label>
        <input
          className="text-input"
          type="password"
          id="password"
          placeholder="Password"
          {...register("password", inputRules.signInPassword)}
        />
        {errors.password && <FormError>{errors.password.message}</FormError>}
      </div>

      <Btn theme="quaternary" isLoading={isSignInLoading}>
        Log In
        {isSignInLoading && <Loader />}
      </Btn>

      <p>
        <NavLink to={PATHS.forgotPassword} className="link">
          Forgot Password?
        </NavLink>
      </p>
    </form>
  );
}
