import * as React from "react";
import { NavLink } from "react-router";

import { HeartBtn } from "./heart-btn";
import { usePostNewMessageMutation } from "../chat-slice";
import { useAppSelector } from "../../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../../../user-profile_protected";
import { Message } from "../../../ui/message/message-component";
import { PATHS } from "../../../../config/constants";
import { IoSend } from "../../../ui/icons";

import styles from "./chat-controls.module.css";
import icons from "./../../../../assets/icons.svg";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isStreamOnline: boolean;
  isDisabled: boolean;
}

export function ChatControls(props: Props): React.ReactElement {
  const user = useAppSelector(selectCurrentUserProfile);
  const [msgInput, setMsgInput] = React.useState("");

  //

  const [
    addNewMessage,
    { isLoading: isPostNewMsgLoading, isError: isPostNewMsgError },
  ] = usePostNewMessageMutation();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMsgInput(e.target.value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;

    const trimmedMsg = msgInput.trim();
    if (trimmedMsg.length > 0 && trimmedMsg.length < 500) {
      try {
        await addNewMessage({ message: trimmedMsg }).unwrap();
        setMsgInput("");
      } catch (err) {
        console.error("Failed to save the message: ", err);
      }
    }

    // Hide keyboard on mobile devices
    const input = document.getElementById("chat-message");
    input?.blur();
  }

  return user ? (
    <div className={`${styles["chat-controls"]} ${props.className || ""}`}>
      <HeartBtn isStreamOnline={props.isStreamOnline} />
      <form className={styles["chat-controls__form"]} onSubmit={handleSubmit}>
        <label className="form__label" htmlFor="chat-message" />
        <input
          id="chat-message"
          className={styles["chat-controls__input"]}
          type="text"
          maxLength={500}
          minLength={1}
          name="chat-message"
          autoComplete="off"
          placeholder="Type a message here..."
          value={msgInput}
          onChange={handleChange}
          disabled={props.isDisabled}
        />
        {
          <button
            className={styles["chat-controls__send-btn"]}
            type="submit"
            name="chat-message"
            value=""
            disabled={isPostNewMsgLoading && props.isDisabled}
          >
            <IoSend
              className={`${styles["chat-controls__send-btn-icon"]} ${styles["default-icon"]}`}
            />
          </button>
        }
      </form>
    </div>
  ) : (
    <Message type="info">
      <NavLink end to={PATHS.signIn}>
        Sign In to leave a message
      </NavLink>
    </Message>
  );
}
