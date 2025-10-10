import styles from "./subheader.module.css";

interface Props extends React.HTMLAttributes<HTMLElement> {
  name: string;
}
export function Subheader(props: Props) {
  return (
    <header className={styles["subheader"]}>
      <h5>{props.name}</h5>
    </header>
  );
}
