import styles from "./icons.module.css";

export function HeartIcon(props: React.HTMLAttributes<SVGAElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 26.458 26.458"
      className={`${styles["icons"]} ${props.className}`}
    >
      <path d="M7.383 2.748c1.353 0 2.594.429 3.688 1.275 1.049.81 1.747 1.844 2.158 2.595.411-.751 1.11-1.784 2.158-2.595 1.094-.846 2.335-1.275 3.688-1.275 3.778 0 6.626 3.09 6.626 7.187 0 4.426-3.554 7.454-8.933 12.039-.914.778-1.95 1.66-3.026 2.602a.778.778 0 0 1-1.026 0 307.403 307.403 0 0 0-3.026-2.603C4.31 17.39.757 14.361.757 9.935c0-4.097 2.849-7.187 6.626-7.187z" />
    </svg>
  );
}
