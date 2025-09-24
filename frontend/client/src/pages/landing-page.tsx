import { BsFillChatDotsFill } from "react-icons/bs";
import { DjIcon } from "../features/ui/icons/dj";
import { LinkBtn } from "../features/ui/btn";
import { FaCalendar, FaLinux, FaShare } from "../features/ui/icons";

import styles from "./landing-page.module.css";
import { PATHS } from "../app/routes";

function DownloadBox() {
  return (
    <section className={styles["download-box"]}>
      <h5>Download</h5>
      <div>
        <a
          href="https://github.com/andreyponomarevru/livestreamer/tree/main/streaming-client"
          className={styles["download-box__item"]}
        >
          <FaLinux className={styles["download-box__icon"]} />
          Linux
        </a>
      </div>
    </section>
  );
}

export function LandingPage() {
  const nav = (
    <nav className={styles["landing-page__nav"]}>
      <LinkBtn
        theme="secondary"
        href="https://github.com/andreyponomarevru/livestreamer"
      >
        Doc
      </LinkBtn>
      <LinkBtn theme="quaternary" href={PATHS.signIn}>
        <DjIcon className={styles["landing-page__dj-icon"]} />
        Create live stream
      </LinkBtn>
    </nav>
  );

  return (
    <main className={styles["landing-page"]}>
      {nav}

      <div className={styles["landing-page__col"]}>
        <section
          className={`${styles["landing-page__one"]} ${styles["landing-page__block"]}`}
        >
          <div className={styles["landing-page__number"]}>
            <h1>1</h1>
            <FaCalendar className={styles["landing-page__icon"]} />
          </div>
          <h4>Create a new Stream</h4>
          <p>
            <a href="/sign-up" className="link">
              Sign up
            </a>{" "}
            and schedule a new stream
          </p>
        </section>

        <section
          className={`${styles["landing-page__two"]} ${styles["landing-page__block"]}`}
        >
          <div className={styles["landing-page__number"]}>
            <h1>2</h1>
            <DjIcon className={styles["landing-page__icon"]} />
          </div>
          <h4>Download and start Audio Streaming Client</h4>
          <p>
            Then{" "}
            <a
              href="https://github.com/andreyponomarevru/livestreamer/tree/main/streaming-client"
              className="link"
            >
              download the Audio Streaming Client
            </a>
            * and start the stream.{" "}
          </p>
          <p>
            At the moment, there is only a CLI client. The GUI client is in
            development and will be available soon.)
          </p>
          <small className={styles["landing-page__note"]}>
            * currently available only for Linux
          </small>
          <DownloadBox />
        </section>

        <section
          className={`${styles["landing-page__three"]} ${styles["landing-page__block"]}`}
        >
          <div className={styles["landing-page__number"]}>
            <h1>3</h1>
            <FaShare className={styles["landing-page__icon"]} />
          </div>
          <h4>Share a link to the stream</h4>
        </section>

        <section
          className={`${styles["landing-page__four"]} ${styles["landing-page__block"]}`}
        >
          <div className={styles["landing-page__number"]}>
            <h1>4</h1>
            <BsFillChatDotsFill className={styles["landing-page__icon"]} />
          </div>
          <h4>Chat and enjoy music with friends</h4>
        </section>
      </div>

      {nav}
    </main>
  );
}
