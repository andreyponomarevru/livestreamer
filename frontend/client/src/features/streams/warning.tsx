import { Btn } from "../ui/btn";

import styles from "./warning.module.css";

export function Warning() {
  return (
    <div className={styles["warning"]}>
      <div className={styles["warning__message"]}>
        <p className="text-size-l">
          The{" "}
          <a
            className="link"
            href="https://github.com/andreyponomarevru/livestreamer/tree/main/streaming-client"
          >
            Audio Streaming Client
          </a>{" "}
          saves your stream only locally on your computer.
        </p>
        <p>
          We do not save the streams' audio to our servers. What we keep is only
          chat history and stream statistics. Check out the{" "}
          <a
            className="link"
            href="https://github.com/andreyponomarevru/livestreamer"
          >
            docs
          </a>{" "}
          for the details.
        </p>
        <Btn className={styles["warning__hide-btn"]} theme="quaternary">
          OK
        </Btn>
      </div>
    </div>
  );
}
