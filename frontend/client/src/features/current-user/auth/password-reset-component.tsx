import * as React from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";

import { inputRules, type InputTypes } from "../../../config/input-rules";
import { Message } from "../../ui/message/message-component";
import { Loader } from "../../ui/loader/loader-component";
import { Btn } from "../../ui/btn";
import { FormError } from "../../ui/form-error/form-error-component";
import { PATHS } from "../../../config/constants";
import { useQuery } from "../../../hooks/use-query";
import { selectCurrentUserProfile, useUpdatePasswordMutation } from "..";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { Box } from "../../ui/box/box-component";

export function PassResetForm(
  props: React.HTMLAttributes<HTMLDivElement>,
): React.ReactElement {
  async function handlePasswordReset({ password }: { password: string }) {
    clearFormErrors();

    try {
      await updatePassword({ newPassword: password, token }).unwrap();
      resetForm();
    } catch (err) {
      console.error(err);

      if (updatePasswordResponse.error) {
        setFormError("password", {
          type: "string",
          message: String(updatePasswordResponse.error),
        });
      }
    }
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    console.info("User is already signed in");
    if (user) navigate(PATHS.root);
  }, [user, navigate]);

  const query = useQuery();
  const token = query.get("token");
  React.useEffect(() => {
    if (!token) {
      console.error("Can't proceed because token in query string is not set");
      navigate(PATHS.root);
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState,
    reset: resetForm,
    clearErrors: clearFormErrors,
    setError: setFormError,
  } = useForm<InputTypes>({ mode: "onBlur" });
  const [updatePassword, updatePasswordResponse] = useUpdatePasswordMutation();

  return (
    <Box heading="Password Reset">
      <form
        className={`form form_layout_col ${props.className || ""}`}
        onSubmit={handleSubmit(handlePasswordReset, handleErrors)}
      >
        {updatePasswordResponse.isLoading && <Loader />}

        {updatePasswordResponse.isUninitialized && (
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
              {formState.errors.password && (
                <FormError>{formState.errors.password.message}</FormError>
              )}
            </div>

            <Btn theme="quaternary">
              Submit
              {updatePasswordResponse.isLoading && <Loader />}
            </Btn>

            <div>
              Need help?{" "}
              <a href="mailto:info@andreyponomarev.ru" className="link">
                Contact us
              </a>
            </div>
          </React.Fragment>
        )}

        {updatePasswordResponse.isSuccess && (
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
