import * as React from "react";
import { Navigate, type RouteProps } from "react-router-dom";

import { PATHS } from "../../app/routes";
import { RESOURCES, PERMISSIONS } from "../../config/constants";
import { useAppSelector } from "../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../current-user/current-user-slice";

type Props = RouteProps & {
  requiresPermission?: {
    action: (typeof PERMISSIONS)[number];
    resource: (typeof RESOURCES)[number];
  };
  children: React.ReactNode;
};

export function ProtectedRoute(props: Props): React.ReactElement {
  const user = useAppSelector(selectCurrentUserProfile);
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to={PATHS.signIn} />;
  }

  if (!props.requiresPermission) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  if (props.requiresPermission) {
    const isAuthorized = user?.permissions[
      props.requiresPermission.resource
    ]?.includes(props.requiresPermission.action);
    return isAuthorized ? (
      <React.Fragment>{props.children}</React.Fragment>
    ) : (
      <Navigate to={PATHS.root} replace />
    );
  }

  return <Navigate to={PATHS.root} />;
}
