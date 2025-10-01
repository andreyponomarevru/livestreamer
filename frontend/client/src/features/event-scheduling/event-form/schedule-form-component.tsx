import React from "react";

import { Btn } from "../../../features/ui/btn";
import { Loader } from "../../ui/loader/loader-component";

import styles from "./schedule-form.module.css";

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
