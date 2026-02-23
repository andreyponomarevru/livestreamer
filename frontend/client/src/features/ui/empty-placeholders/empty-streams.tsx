import { DjIcon, CalendarIcon } from "../icons";
import { LinkBtn } from "../btn";
import { PATHS } from "../../../config/constants";
import { EmptyPlaceholder } from "./empty-placeholder";

import styles from "./empty-placeholder.module.css";

export function EmptyStreams() {
  return (
    <EmptyPlaceholder>
      <CalendarIcon className={styles["empty-placeholder__icon"]} />

      <p>No streams yet.</p>
      <LinkBtn theme="quaternary" href={PATHS.signIn}>
        <DjIcon className="icon" />
        Start live stream
      </LinkBtn>
    </EmptyPlaceholder>
  );
}
