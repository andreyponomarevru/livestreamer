import { DjIcon, CalendarIcon } from "../ui/icons";
import { LinkBtn } from "../ui/btn";
import { PATHS } from "../../config/constants";

import styles from "./empty-list.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  canScheduleBroadcast: boolean;
}

export function EmptyList(props: Props) {
  return (
    <div className={styles["empty-list"]}>
      <CalendarIcon className={styles["empty-list__icon"]} />

      {props.canScheduleBroadcast ? (
        <>
          <p>No streams scheduled</p>
          <LinkBtn theme="quaternary" href={PATHS.signIn}>
            <DjIcon className="icon" />
            Start live stream
          </LinkBtn>
        </>
      ) : (
        <p>Chilllout Aggregator does not have any streams yet</p>
      )}
    </div>
  );
}
