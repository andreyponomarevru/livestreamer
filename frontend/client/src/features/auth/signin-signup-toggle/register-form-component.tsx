import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { inputRules, type InputTypes } from "../../../config/input-rules";
import { type RegisterForm } from "../../../types";
import { Loader } from "../../ui/loader/loader-component";
import { Btn } from "../../ui/btn";
import { PATHS } from "../../../config/constants";
import { FormError } from "../../ui/form-error/form-error-component";
import { useSignUpMutation } from "../auth-slice";

export function RegisterForm(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  const [
    signUp,
    {
      isError: isSignUpError,
      isLoading: isSignUpLoading,
      isSuccess: isSignUpSuccess,
      error: signUpError,
    },
  ] = useSignUpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<InputTypes>({ mode: "onBlur" });
  const navigate = useNavigate();
  React.useEffect(() => {
    if (isSignUpSuccess) navigate(PATHS.confirmationRequired);
    else if (isSignUpError && signUpError) {
      setError("root", { type: "string", message: String(signUpError) });
    }
  }, [navigate, isSignUpError, setError, signUpError, isSignUpSuccess]);

  //

  function handleSignUp(form: RegisterForm) {
    console.log("[handleSignup handler]", form);

    clearErrors();

    signUp({
      email: form.email,
      username: form.username,
      password: form.password,
    });
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  function handleChange() {
    clearErrors();
  }

  return (
    <form
      className={`form form_layout_col ${props.className || ""}`}
      onSubmit={handleSubmit(handleSignUp, handleErrors)}
      onChange={handleChange}
    >
      <div>
        <label className="form__label" htmlFor="email" />
        <input
          className="text-input"
          type="email"
          id="email"
          placeholder="Email"
          {...register("email", inputRules.email)}
        />
        {errors.email && <FormError>{errors.email.message}</FormError>}
      </div>

      <div>
        <label className="form__label" htmlFor="username" />
        <input
          className="text-input"
          type="text"
          id="username"
          placeholder="Username"
          {...register("username", inputRules.username)}
        />
        {errors.username && <FormError> {errors.username?.message}</FormError>}
      </div>

      <div>
        <label className="form__label" htmlFor="password" />
        <input
          className="text-input"
          type="password"
          id="password"
          placeholder="Password"
          {...register("password", inputRules.password)}
        />
        {errors.password && <FormError>{errors.password.message}</FormError>}
      </div>

      <Btn isLoading={isSignUpLoading} theme="quaternary">
        Create Account
        {isSignUpLoading && <Loader />}
      </Btn>
    </form>
  );
}
