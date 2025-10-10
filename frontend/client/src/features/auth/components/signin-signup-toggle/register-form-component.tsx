import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { inputRules, type InputTypes } from "../../../../config/input-rules";
import { API_ROOT_URL } from "../../../../config/env";
import { type RegisterForm } from "../../../../types";
import { useIsMounted } from "../../../../hooks/use-is-mounted";
import { useFetch } from "../../../../hooks/use-fetch";
import { Loader } from "../../../ui/loader/loader-component";
import { Btn } from "../../../ui/btn";
import { PATHS } from "../../../../config/constants";
import { FormError } from "../../../ui/form-error/form-error-component";

export function RegisterForm(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  function handleSignUp(form: RegisterForm) {
    console.log("[handleSignup handler]", form);

    clearErrors();

    sendRegisterRequest(`${API_ROOT_URL}/user`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        authorization: `Basic ${btoa(`${form.username}:${form.password}`)}`,
      },
      body: JSON.stringify({ email: form.email }),
    });
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  function handleChange() {
    clearErrors();
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<InputTypes>({ mode: "onBlur" });
  const navigate = useNavigate();
  const isMounted = useIsMounted();
  const { state: registerResponse, fetchNow: sendRegisterRequest } = useFetch();
  React.useEffect(() => {
    if (isMounted && registerResponse.response) {
      navigate(PATHS.confirmationRequired);
    } else if (isMounted && registerResponse.error) {
      setError("username", {
        type: "string",
        message: String(registerResponse.error),
      });
    }
  }, [isMounted, registerResponse]);

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

      <Btn
        isLoading={registerResponse.isLoading}
        className="rm__btns"
        theme="quaternary"
      >
        Create Account
        {registerResponse.isLoading && <Loader />}
      </Btn>
    </form>
  );
}
