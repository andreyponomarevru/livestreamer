import styles from "./icons.module.css";

export function EmptyImageIcon(props: React.HTMLAttributes<SVGAElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 95.406 95.406"
      className={`${styles["icons"]} ${props.className}`}
    >
      <path d="M0 0v65.353c6.557-11.488 15.134-21.878 24.708-21.878 9.386 0 7.197 22.779 16.583 22.78 16.466 0 12.63-39.99 29.096-39.958 9.23.015 17.737 7.304 25.019 17.146V.002Zm33.476 8.682a11.57 11.57 0 0 1 11.57 11.57 11.57 11.57 0 0 1-11.57 11.57 11.57 11.57 0 0 1-11.57-11.57 11.57 11.57 0 0 1 11.57-11.57" />
    </svg>
  );
}
