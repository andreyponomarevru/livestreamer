import styles from "./empty-placeholder.module.css";

export function EmptyPlaceholder(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={styles["empty-placeholder"]}>{props.children}</div>;
}
