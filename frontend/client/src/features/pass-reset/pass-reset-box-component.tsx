import * as React from "react";

import { Box } from "../ui/box/box";
import { PassResetForm } from "./pass-reset-form-component";
import { useNavigate } from "react-router";
import { PATHS } from "../../app/routes";
import { useAppSelector } from "../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../current-user/current-user-slice";

function PassResetBox() {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  }, [user, navigate]);

  return (
    <Box>
      <h1 className="box__header">Password Reset</h1>
      <PassResetForm />
    </Box>
  );
}

export { PassResetBox };
