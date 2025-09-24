import { Outlet as CurrentPageContent } from "react-router-dom";

import { Navbar } from "./navbar/navbar-component";
import { useGetCurrentUserQuery } from "../../current-user";
import { Loader } from "../../ui/loader/loader-component";

export function Layout() {
  const { isLoading } = useGetCurrentUserQuery();

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <CurrentPageContent />
    </>
  );
}
