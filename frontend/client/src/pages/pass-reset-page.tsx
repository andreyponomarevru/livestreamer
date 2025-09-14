import React from "react";

import { PassResetBox } from "../features/current-user";

import "./pass-reset-page.scss";

function PassResetPage(): React.ReactElement {
  return (
    <div className="pass-reset-page pass-reset-page_box">
      <PassResetBox />
    </div>
  );
}

export { PassResetPage };
