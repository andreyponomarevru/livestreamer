import { useForm } from "react-hook-form";

import { Btn } from "../ui/btn";
import { FaCamera } from "../ui/icons";
import { inputRules, type InputTypes } from "../../config/input-rules";
import { Loader } from "../ui/loader/loader-component";

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
      className={`form form_layout_col ${styles["create-stream-form"]} page__box`}
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

/*
export function ScheduleForm(): React.ReactElement {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [broadcastTitle, setBroadcastTitle] = React.useState("");

  function handleDatetimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === "broadcast-start") {
      setStartDate(e.target.value);
    }

    if (e.target.name === "broadcast-end") {
      setEndDate(e.target.value);
    }
  }

  function handleBroadcastTitleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setBroadcastTitle(e.target.value);
  }

  async function handleScheduleBroadcast(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    if (startDate === "" || endDate === "" || broadcastTitle === "")
      console.error(
        "Fill in the broadcast title and choose start and end dates",
      );
    else {
      // TODO:
      // import here function calling the API

      const JSON = {
        title: broadcastTitle,
        startAt: startDate,
        endAt: endDate,
      };
      console.log(JSON);
    }
  }

  React.useEffect(() => {
    console.log(`${startDate} — ${endDate}`);
  });

  // TODO:
  // set the min value of both inputs to current day/time

  return (
    <form className={styles["schedule-form"]}>
      <label className="form__label" htmlFor="broadcast-title"></label>
      <input
        id="broadcast-title"
        type="text"
        placeholder="Broadcast title"
        onChange={handleBroadcastTitleInput}
      />
      <label className="form__label" htmlFor="broadcast-start">
        Choose a <em>start</em> time for your broadcast:
      </label>
      <input
        type="datetime-local"
        id="broadcast-start"
        name="broadcast-start"
        min="2020-06-07T00:00"
        onChange={handleDatetimeChange}
      />
      <label htmlFor="broadcast-end">
        Choose an <em>end</em> time for your broadcast:
      </label>
      <input
        type="datetime-local"
        id="broadcast-end"
        name="broadcast-end"
        min="2020-06-07T00:00"
        onChange={handleDatetimeChange}
      />
      <Btn handleClick={(e) => handleScheduleBroadcast(e)} theme="primary">
        Schedule Broadcast
        <Loader />
      </Btn>
    </form>
  );
}
*/
