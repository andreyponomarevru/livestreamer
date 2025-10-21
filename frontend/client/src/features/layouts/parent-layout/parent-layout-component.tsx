import { Outlet as CurrentPageContent } from "react-router";

import { Navbar } from "./navbar";
import { useGetCurrentUserQuery } from "../../auth/current-user-slice";
import { Loader } from "../../ui/loader/loader-component";

export function ParentLayout() {
  const { isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <>
        <Navbar />
        <CurrentPageContent />
      </>
    );
  }
}
