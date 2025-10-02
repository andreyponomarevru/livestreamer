import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "./navbar/navbar-component";
import { useGetCurrentUserQuery } from "../../current-user_private";
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
