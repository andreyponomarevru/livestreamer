import * as React from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import { inputRules, type InputTypes } from "../../../../config/input-rules";
import { Message } from "../../../ui/message/message-component";
import { Loader } from "../../../ui/loader/loader-component";
import { Btn } from "../../../ui/btn";
import { FormError } from "../../../ui/form-error/form-error-component";
import { PATHS } from "../../../../config/constants";
import { useQuery } from "../../../../hooks/use-query";
import {
  selectCurrentUserProfile,
  useUpdatePasswordMutation,
} from "../../current-user-slice";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { Box } from "../../../ui/box/box-component";

export function PassResetForm(
  props: React.HTMLAttributes<HTMLDivElement>,
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
  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  });

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
      //navigate(PATHS.root);
    }
  }, [token, navigate]);

  return (
    <Box heading="Password Reset">
      <form
        className={`form ${props.className || ""}`}
        onSubmit={handleSubmit(handlePasswordReset, handleErrors)}
      >
        {newPasswordResponse.isLoading && <Loader />}

        {newPasswordResponse.isUninitialized && (
          <React.Fragment>
            <div>Enter your new password below.</div>

            <div>
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

            <Btn theme="quaternary">
              Submit
              {newPasswordResponse.isLoading && <Loader />}
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
            <Link to={PATHS.signIn} className="link">
              log in
            </Link>{" "}
            with your new password.
          </Message>
        )}
      </form>
    </Box>
  );
}
