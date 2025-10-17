import { DjIcon, CalendarIcon } from "../ui/icons";
import { LinkBtn } from "../ui/btn";
import { PATHS } from "../../config/constants";
import { EmptyPlaceholder } from "./empty-placeholder";

import styles from "./empty-placeholder.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  canScheduleBroadcast: boolean;
  username?: string;
}

export function EmptyStreams(props: Props) {
  return (
    <EmptyPlaceholder>
      <CalendarIcon className={styles["empty-placeholder__icon"]} />

      {props.canScheduleBroadcast ? (
        <>
          <p>No streams scheduled</p>
          <LinkBtn theme="quaternary" href={PATHS.signIn}>
            <DjIcon className="icon" />
            Start live stream
          </LinkBtn>
        </>
      ) : (
        <p>{props.username || "Unknown"} does not have any streams yet</p>
      )}
    </EmptyPlaceholder>
  );
}
