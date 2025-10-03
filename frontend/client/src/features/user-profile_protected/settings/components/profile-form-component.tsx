import * as React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { inputRules, type InputTypes } from "../../../../config/input-rules";
import { useFetch } from "../../../../hooks/use-fetch";
import { API_ROOT_URL } from "../../../../config/env";
import { type APIResponseSuccess, type User } from "../../../../types";
import { Btn } from "../../../ui/btn/btn-component";
import { useIsMounted } from "../../../../hooks/use-is-mounted";
import { Loader } from "../../../ui/loader/loader-component";
import { FormError } from "../../../ui/form-error/form-error-component";
import { PATHS } from "../../../../config/constants";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../current-user-slice";
import { FaCircleUser } from "../../../ui/icons";

import styles from "./profile-form.module.css";

type UserSettings = { username: string };

export function ProfileForm(): React.ReactElement {
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
      className="form form_layout_col"
      onSubmit={handleSubmit(handleSaveChanges, handleFormErrors)}
      onChange={handleChange}
    >
      <div className="form__layout_nested-rows">
        <div className="form__layout_text-input">
          <label className="form__label" htmlFor="displayname">
            Display Name
          </label>
          <input
            id="displayname"
            type="text"
            className="text-input"
            {...register("username", inputRules.username)}
          />
        </div>

        <div className="form__layout_text-input">
          <div></div>
          <div className="form__input-tip">
            <p>At least 3 characters</p>
            {errors.username && (
              <FormError>{errors.username.message}</FormError>
            )}
          </div>
        </div>
      </div>

      <hr className="hr" />

      <div className="form__layout_text-input">
        <label className="form__label" htmlFor="username">
          Profile Picture
        </label>
        <div className={styles["profile-form__profile-pic"]}>
          <div>
            <input
              id="uploadFile"
              type="file"
              className="text-input hidden"
              {...register("username", inputRules.username)}
            />
            <Btn theme="secondary" id="uploadTrigger">
              Choose File
            </Btn>
          </div>
          <FaCircleUser className={styles["profile-form__user-photo"]} />
        </div>
      </div>

      <hr className="hr" />

      <div className="form__layout_text-input">
        <label className="form__label" htmlFor="website">
          Website
        </label>
        <input
          id="website"
          type="text"
          className="text-input"
          {...register("username", inputRules.username)}
        />
      </div>

      <div className="form__layout_textarea-input">
        <label className="form__label" htmlFor="about">
          About
        </label>
        <textarea
          id="about"
          className="textarea-input"
          {...register("username", inputRules.username)}
        />
      </div>

      <hr className="hr" />

      <div className="form__layout_textarea-input">
        <label className="form__label" htmlFor="timezone">
          Select Timezone
        </label>
        <select
          id="timezone"
          className="text-input"
          {...register("username", inputRules.username)}
        >
          <option value="volvo">Volvo</option>
          <option value="saab">Saab</option>
          <option value="mercedes">Mercedes</option>
          <option value="audi">Audi</option>
        </select>
      </div>

      <hr className="hr" />

      <div className="form__btns">
        <span></span>
        <Btn theme="primary" className={styles["profile-form__save-btn"]}>
          Save Changes {updatedUserResponse.isLoading && <Loader />}
        </Btn>
      </div>
    </form>
  );
}
