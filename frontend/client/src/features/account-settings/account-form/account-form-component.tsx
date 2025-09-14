import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { inputRules, type InputTypes } from "../../../config/input-rules";
import { useFetch } from "../../../hooks/use-fetch";
import { API_ROOT_URL } from "../../../config/env";
import { type APIResponseSuccess, type User } from "../../../types";
import { Btn } from "../../ui/btn/btn";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { Loader } from "../../ui/loader/loader";
import { FormError } from "../../ui/form-error/form-error";
import { PATHS } from "../../../app/routes";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../current-user/current-user-slice";

import styles from "./account-form.module.css";

type UserSettings = { username: string };

function AccountForm(): React.ReactElement {
  function handleSaveChanges(userSettings: UserSettings) {
    clearErrors();
    sendUpdatedUserRequest(`${API_ROOT_URL}/user`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(userSettings),
    });
  }

  function handleChange() {
    clearErrors();
  }

  function handleFormErrors(errors: unknown) {
    console.error(errors);
  }

  const user = useAppSelector(selectCurrentUserProfile);
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<InputTypes>({
    mode: "onBlur",
    defaultValues: { username: user?.username },
  });

  React.useEffect(() => {
    if (isMounted && user) {
      setValue("username", user.username, { shouldValidate: false });
    }
  }, [isMounted, user]);

  const { state: updatedUserResponse, fetchNow: sendUpdatedUserRequest } =
    useFetch<APIResponseSuccess<User>>();
  React.useEffect(() => {
    if (isMounted && updatedUserResponse.response?.body) {
      //const user: User = updatedUserResponse.response.body.results;
      //auth.setUser(user);
      navigate(PATHS.root);
    } else if (isMounted && updatedUserResponse.error) {
      setError("username", {
        type: "string",
        message: String(updatedUserResponse.error),
      });
    }
  }, [isMounted, updatedUserResponse]);

  return (
    <form
      className={styles.accountForm}
      onSubmit={handleSubmit(handleSaveChanges, handleFormErrors)}
      onChange={handleChange}
    >
      <div className={styles.detailsRow}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          className="text-input"
          {...register("username", inputRules.username)}
        />
      </div>

      {errors.username && <FormError>{errors.username.message}</FormError>}

      <Btn theme="white" name="Save" isLoading={updatedUserResponse.isLoading}>
        <Loader for="btn" color="black" />
      </Btn>
    </form>
  );
}

export { AccountForm };
