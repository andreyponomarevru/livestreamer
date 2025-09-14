import * as React from "react";
import { useForm } from "react-hook-form";

import { inputRules, type InputTypes } from "../../config/input-rules";
import { Message } from "../ui/message/message";
import { Loader } from "../ui/loader/loader";
import { Btn } from "../ui/btn";
import { FormError } from "../ui/form-error/form-error";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../app/routes";
import { useQuery } from "../../hooks/use-query";
import { useUpdatePasswordMutation } from "../current-user";

import "../ui/btn/btn.scss";
import "../ui/text-input/text-input.scss";
import "../ui/btn/btn.scss";
import "../ui/form/form.scss";

function PassResetForm(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  async function handlePasswordReset({ password }: { password: string }) {
    clearErrors();

    updatePassword({ newPassword: password, token });

    reset();
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  const navigate = useNavigate();
  const query = useQuery();
  const token = query.get("token");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
    setError,
  } = useForm<InputTypes>({ mode: "onBlur" });
  const [updatePassword, newPasswordResponse] = useUpdatePasswordMutation();
  React.useEffect(() => {
    if (newPasswordResponse.error) {
      setError("password", {
        type: "string",
        message: String(newPasswordResponse.error),
      });
    }
  }, [newPasswordResponse.error, setError]);

  React.useEffect(() => {
    if (!token) {
      console.error("[PassResetForm] Token in query string is not set");
      navigate(PATHS.root);
    }
  }, [token, navigate]);

  return (
    <form
      className={`form ${props.className || ""}`}
      onSubmit={handleSubmit(handlePasswordReset, handleErrors)}
    >
      {newPasswordResponse.isLoading && <Loader for="page" color="pink" />}

      {newPasswordResponse.isUninitialized && (
        <React.Fragment>
          <div>Enter your new password below.</div>

          <div className="form__form-group">
            <label className="form__label" htmlFor="password" />
            <input
              className="form text-input"
              type="password"
              id="password"
              placeholder="New Password"
              {...register("password", inputRules.password)}
            />
            {errors.password && (
              <FormError>{errors.password.message}</FormError>
            )}
          </div>

          <Btn
            name="Submit"
            theme="white"
            isLoading={newPasswordResponse.isLoading}
          >
            <Loader color="black" for="btn" />
          </Btn>

          <div>
            Need help?{" "}
            <a href="mailto:info@andreyponomarev.ru" className="link">
              Contact us
            </a>
          </div>
        </React.Fragment>
      )}

      {newPasswordResponse.isSuccess && (
        <Message type="success">
          Password successfully updated. You can now{" "}
          <Link to={PATHS.signIn}>log in</Link> with your new password.
        </Message>
      )}
    </form>
  );
}

export { PassResetForm };
