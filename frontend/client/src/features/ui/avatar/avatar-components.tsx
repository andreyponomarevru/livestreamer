import { FaCircleUser } from "../icons";
import styles from "./avatar.module.css";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  apiRootUrl: string;
  imgUrl?: string;
}

export function Avatar(props: Props) {
  const url = new URL(props.apiRootUrl).origin + "/" + props.imgUrl;

  const className = `${styles["avatar"]} ${props.className || ""}`;

  return props.imgUrl ? (
    <img src={url} className={className} />
  ) : (
    <FaCircleUser color="white" className={className} />
  );
}
