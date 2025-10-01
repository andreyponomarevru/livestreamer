import styles from "./share-stream-modal.module.css";

import { PiCopyFill } from "../../ui/icons";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
}

export function ShareStreamModal(props: Props) {
  return (
    <div className={styles["share-stream-modal"]}>
      <input
        type="text"
        readOnly
        value={props.url}
        className={`${styles["share-stream-modal__input"]} text-input`}
      />
      <button className={styles["share-stream-modal__btn"]}>
        <PiCopyFill className={styles["share-stream-modal__btn-icon"]} />
      </button>
    </div>
  );
}
