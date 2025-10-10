import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "./navbar/navbar-component";
import { useGetCurrentUserQuery } from "../../auth/current-user-slice";
import { Loader } from "../../ui/loader/loader-component";

export function MainLayout() {
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
