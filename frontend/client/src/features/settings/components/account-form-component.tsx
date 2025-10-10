import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { inputRules, type InputTypes } from "../../../config/input-rules";
import { useFetch } from "../../../hooks/use-fetch";
import { API_ROOT_URL } from "../../../config/env";
import { type APIResponseSuccess, type User } from "../../../types";
import { Btn } from "../../ui/btn/btn-component";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { Loader } from "../../ui/loader/loader-component";
import { FormError } from "../../ui/form-error/form-error-component";
import { PATHS } from "../../../config/constants";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../auth";

import styles from "./account-form.module.css";

type UserSettings = { username: string };

export function AccountForm(): React.ReactElement {
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

  /* Delete account */
  function deleteAccount() {
    sendDeleteUserRequest(`${API_ROOT_URL}/user`, { method: "DELETE" });
  }

  const { state: deleteUserResponse, fetchNow: sendDeleteUserRequest } =
    useFetch();
  React.useEffect(() => {
    if (isMounted && deleteUserResponse.response) {
      navigate(PATHS.root);
    }
  }, [isMounted, deleteUserResponse]);

  return (
    <form
      className="form form_layout_col"
      onSubmit={handleSubmit(handleSaveChanges, handleFormErrors)}
      onChange={handleChange}
    >
      <div className="form__layout_text-input">
        <label className="form__label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="text-input"
          {...register("username", inputRules.username)}
        />
      </div>

      <hr className="hr" />

      <div className="form__layout_nested-rows">
        <div className="form__layout_text-input">
          <label className="form__label" htmlFor="username">
            Username <span className="form__input-details">Profile URL</span>
          </label>
          <input
            id="username"
            type="text"
            className="text-input"
            {...register("username", inputRules.username)}
          />
        </div>
        <div className="form__layout_text-input">
          <div></div>
          <div className="form__input-tip">At least 3 characters</div>
        </div>
      </div>

      <hr className="hr" />

      <div className="form__layout_nested-rows">
        <div className="form__layout_text-input">
          <label className="form__label" htmlFor="website">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="text-input"
            {...register("username", inputRules.username)}
          />
        </div>
        <div className="form__layout_text-input">
          <div></div>
          <div className="form__input-tip">At least 6 characters</div>
        </div>
      </div>

      <div className="form__layout_nested-rows">
        <div className="form__layout_text-input">
          <label className="form__label" htmlFor="website">
            New Password
          </label>
          <input
            id="password"
            type="password"
            className="text-input"
            {...register("username", inputRules.username)}
          />
        </div>
        <div className="form__layout_text-input">
          <div></div>
          <div className="form__input-tip">At least 6 characters</div>
        </div>
      </div>

      <hr className="hr" />

      <div className={styles["account-form__btns"]}>
        <Btn
          theme="quaternary"
          handleClick={deleteAccount}
          isLoading={deleteUserResponse.isLoading}
        >
          Delete Account {deleteUserResponse.isLoading && <Loader />}
        </Btn>

        <Btn theme="primary" className={styles["account-form__save-btn"]}>
          Save Changes {updatedUserResponse.isLoading && <Loader />}
        </Btn>

        {deleteUserResponse.error && (
          <Message type="danger">{deleteUserResponse.error}</Message>
        )}
      </div>
    </form>
  );
}
