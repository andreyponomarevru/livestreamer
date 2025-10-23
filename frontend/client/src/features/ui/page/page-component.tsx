import styles from "./page.module.css";

export function Page(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={styles["page"]}>{props.children}</div>;
}
