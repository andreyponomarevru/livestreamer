import { Btn } from "../btn";
import { Message } from "../message/message-component";

import styles from "./dismissible-alert.module.css";

interface DismissibleAlertProps {
  children: React.ReactNode;
}

export function DismissibleAlert(props: DismissibleAlertProps) {
  return (
    <Message type="warning" className={styles["dismissible-alert"]}>
      {props.children}
      <Btn className={styles["dismissible-alert__btn"]} theme="quaternary">
        Hide
      </Btn>
    </Message>
  );
}
