import { useForm } from "react-hook-form";

import { Btn } from "../../ui/btn";
import { FaCamera } from "../../ui/icons";
import { inputRules, type InputTypes } from "../../../config/input-rules";

import styles from "./create-stream-form.module.css";

export function CreateStreamForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm<InputTypes>({
    mode: "onBlur",
    defaultValues: {},
  });

  function handleSaveChanges() {}

  function handleChange() {
    clearErrors();
  }

  function handleFormErrors(errors: unknown) {
    console.error(errors);
  }

  return (
    <form
      className={`form form_layout_col ${styles["create-stream-form"]} page-box`}
      onSubmit={handleSubmit(handleSaveChanges, handleFormErrors)}
      onChange={handleChange}
    >
      <h4>Create Stream</h4>

      <div className="form__layout_textarea-input">
        <label className="form__label" htmlFor="username">
          Stream artwork
        </label>
        <div className={styles["create-stream-form__stream-artwork-box"]}>
          <div className={styles["create-stream-form__empty-photo"]}>
            <FaCamera
              className={styles["create-stream-form__empty-photo-icon"]}
            />
          </div>
          <div className={styles["create-stream-form__stream-artwork-col2"]}>
            <div>
              <p>JPG or PNG </p>
              <p>390x390 or higher</p>
              <p>Not larger than 10mb</p>
            </div>
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
          </div>
        </div>
      </div>

      <hr className="hr" />

      <div className="form__layout_text-input form__layout_text-input_1col">
        <label className="form__label" htmlFor="email">
          Stream title
        </label>
        <input
          id="email"
          type="text"
          className="text-input"
          {...register("username", inputRules.username)}
        />
      </div>

      <hr className="hr" />

      <div className={`${styles["create-stream-form__time-grid"]}`}>
        <div className={styles["create-stream-form__time-grid_text-input"]}>
          <label htmlFor="username" className="form__label">
            Start time
          </label>
          <input
            id="username"
            type="text"
            className="text-input"
            {...register("username", inputRules.username)}
          />
        </div>
        <div className={styles["create-stream-form__time-grid_text-input"]}>
          <label className="form__label" htmlFor="username">
            Start date
          </label>
          <input
            id="username"
            type="text"
            className="text-input"
            {...register("username", inputRules.username)}
          />
        </div>
        <div className={styles["create-stream-form__time-grid_text-input"]}>
          <label className="form__label" htmlFor="username">
            End time
          </label>
          <input
            id="username"
            type="text"
            className="text-input"
            {...register("username", inputRules.username)}
          />
        </div>
        <div className={styles["create-stream-form__time-grid_text-input"]}>
          <label className="form__label" htmlFor="username">
            End date
          </label>
          <input
            id="username"
            type="text"
            className="text-input"
            {...register("username", inputRules.username)}
          />
        </div>
        <TimezoneTip />
      </div>

      <hr className="hr" />

      <div className="form__layout_textarea-input">
        <label className="form__label" htmlFor="about">
          Description
        </label>
        <textarea
          id="about"
          className="textarea-input"
          {...register("username", inputRules.username)}
        />
      </div>

      <hr className="hr" />

      <div className={styles["create-stream-form__btns"]}>
        <Btn theme="quaternary">
          Delete {/*deleteUserResponse.isLoading && <Loader />*/}
        </Btn>
        <span></span>
        <Btn theme="secondary">
          Cancel {/*updatedUserResponse.isLoading && <Loader />*/}
        </Btn>
        <Btn theme="primary">
          Save {/*updatedUserResponse.isLoading && <Loader />*/}
        </Btn>
      </div>
    </form>
  );
}

function TimezoneTip() {
  return (
    <div className={styles["create-stream-form__timezone-tip"]}>
      <p>Current timezone: (GMT+00:00) London</p>{" "}
      <p>
        <a href="/settings/profile" className="link">
          Change timezone
        </a>
      </p>
    </div>
  );
}
