import { PiHandsClappingFill } from "../ui/icons";
import { EmptyPlaceholder } from "./empty-placeholder";

import styles from "./empty-placeholder.module.css";

export function EmptyChat(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <EmptyPlaceholder>
      <PiHandsClappingFill className={styles["empty-placeholder__icon"]} />
      <>
        <p className={styles["empty-placeholder__text-l"]}>
          Like what you're hearing?
        </p>
        <p>Send a heart, say hello </p>
      </>
    </EmptyPlaceholder>
  );
}
