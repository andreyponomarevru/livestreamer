import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "./navbar";

export function ParentLayout() {
  return (
    <>
      <Navbar />
      <CurrentPageContent />
    </>
  );
}
