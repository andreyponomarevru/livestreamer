import { Outlet as CurrentPageContent } from "react-router-dom";

import { NavBar } from "./nav-bar-component";
import { useGetCurrentUserQuery } from "../../current-user";
import { Loader } from "../../ui/loader/loader";

export function Layout() {
  const { isLoading } = useGetCurrentUserQuery();

  return isLoading ? (
    <Loader color="pink" />
  ) : (
    <>
      <NavBar />
      <CurrentPageContent />
    </>
  );
}
