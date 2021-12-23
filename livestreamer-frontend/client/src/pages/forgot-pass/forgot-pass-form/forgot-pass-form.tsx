import * as React from "react";
import { useForm } from "react-hook-form";

import "../../../lib/btn/btn.scss";
import "../../../lib/text-input/text-input.scss";
import "../../../lib/btn/btn.scss";
import "../../../lib/form/form.scss";

import { inputRules, InputTypes } from "../../../config/input-rules";
import { API_ROOT_URL } from "../../../config/env";
import { Message } from "../../../lib/message/message";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";
import { Loader } from "../../../lib/loader/loader";
import { Help } from "../../../lib/help/help";
import { Btn } from "../../../lib/btn/btn";
import { FormError } from "../../../lib/form-error/form-error";

function ForgotPasswordForm(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  function handlePasswordReset(email: { email: string }) {
    clearErrors();
    sendPasswordResetRequest(`${API_ROOT_URL}/user/settings/password`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(email),
    });

    reset();
  }

  function handleChange() {
    clearErrors();
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setError,
  } = useForm<InputTypes>({ mode: "onBlur" });
  const isMounted = useIsMounted();
  const { state: passwordResetResponse, fetchNow: sendPasswordResetRequest } =
    useFetch<null>();
  React.useEffect(() => {
    if (isMounted && passwordResetResponse.error) {
      setError("email", {
        type: "string",
        message: passwordResetResponse.error.message,
      });
    }
  }, [isMounted, passwordResetResponse]);

  return (
    <form
      className={`form ${props.className || ""}`}
      onSubmit={handleSubmit(handlePasswordReset, handleErrors)}
      onChange={handleChange}
    >
      {passwordResetResponse.response && (
        <Message type="success">
          Password reset link has been sent to your email.
        </Message>
      )}

      {passwordResetResponse.response === null && (
        <React.Fragment>
          <p>
            Enter the email used for your account and we will send you a link to
            reset your password.
          </p>
          <div className="form__form-group">
            <label className="form__label" htmlFor="email" />
            <input
              className="form text-input"
              type="email"
              id="email"
              placeholder="Email"
              {...register("email", inputRules.email)}
            />
            {errors.email && <FormError>{errors.email.message}</FormError>}
          </div>

          <Btn
            name="Submit"
            theme="white"
            isLoading={passwordResetResponse.isLoading}
          >
            <Loader for="btn" color="black" />
          </Btn>

          <Help />
        </React.Fragment>
      )}
    </form>
  );
}

export { ForgotPasswordForm };
