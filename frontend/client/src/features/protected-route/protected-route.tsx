import * as React from "react";
import { Navigate, type RouteProps } from "react-router";

import { PATHS } from "../../config/constants";
import { RESOURCES, PERMISSIONS } from "../../config/constants";
import { useAppSelector } from "../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../auth";

type Props = RouteProps & {
  requiresPermission?: {
    action: (typeof PERMISSIONS)[number];
    resource: (typeof RESOURCES)[number];
  };
  children: React.ReactNode;
};

export function ProtectedRoute({
  requiresPermission,
  children,
}: Props): React.ReactElement {
  const user = useAppSelector(selectCurrentUserProfile);
  const isAuthenticated = Boolean(user);

  if (!isAuthenticated) {
    console.error("Error: not authenticated. Redirect to sign in page");
    return <Navigate to={PATHS.signIn} replace />;
  }

  if (requiresPermission) {
    const { resource, action } = requiresPermission;
    const isAuthorized = user?.permissions[resource]?.includes(action);

    if (!isAuthorized) {
      console.error(
        `Error: not authorized. User lacks permission for ${action} on ${resource}`,
      );
      return <Navigate to={PATHS.root} replace />;
    }
  }

  return <>{children}</>;
}
