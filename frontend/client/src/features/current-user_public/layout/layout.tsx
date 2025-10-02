import * as React from "react";
import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "../navbar";

import styles from "./layout.module.css";

export function Layout(): React.ReactElement {
  return (
    <main className={`${styles["layout"]} page`}>
      <div className="page-box">
        <Navbar />
        <CurrentPageContent />
      </div>
    </main>
  );
}
