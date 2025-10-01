import * as React from "react";
import { useForm } from "react-hook-form";

import { Box } from "../../../ui/box/box-component";
import { inputRules, type InputTypes } from "../../../../config/input-rules";
import { API_ROOT_URL } from "../../../../config/env";
import { Message } from "../../../ui/message/message-component";
import { useIsMounted } from "../../../../hooks/use-is-mounted";
import { useFetch } from "../../../../hooks/use-fetch";
import { Loader } from "../../../ui/loader/loader-component";
import { Help } from "../../../ui/help/help-component";
import { Btn } from "../../../ui/btn";
import { FormError } from "../../../ui/form-error/form-error-component";

export function PasswordRecovery(props: React.HTMLAttributes<HTMLDivElement>) {
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
        message: String(passwordResetResponse.error),
      });
    }
  }, [isMounted, passwordResetResponse]);

  return (
    <Box heading="Forgot Password">
      {passwordResetResponse.response && (
        <Message type="success">
          Password reset link has been sent to your email.
        </Message>
      )}

      <form
        className={`form form_layout_col ${props.className || ""}`}
        onSubmit={handleSubmit(handlePasswordReset, handleErrors)}
        onChange={handleChange}
      >
        {passwordResetResponse.response === null && (
          <React.Fragment>
            <p>
              Enter the email used for your account and we will send you a link
              to reset your password.
            </p>
            <div>
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

            <Btn theme="quaternary">
              Submit
              {passwordResetResponse.isLoading && <Loader />}
            </Btn>

            <Help />
          </React.Fragment>
        )}
      </form>
    </Box>
  );
}
