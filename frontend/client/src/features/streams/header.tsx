import styles from "./header.module.css";

interface Props extends React.HTMLAttributes<HTMLElement> {
  isViewingOwnPage: boolean;
  streamsCount: number;
}

export function Header(props: Props) {
  return (
    <header className={styles["header"]}>
      {/* TODO: get username from path */}
      <h4>{props.isViewingOwnPage ? "My Streams" : "Streams"}</h4>
      <div>
        <span className={styles["header__counter"]}>{props.streamsCount}</span>
      </div>
    </header>
  );
}
