import * as React from "react";
import { useNavigate } from "react-router";

import { Box } from "../../ui/box/box";
import { PassResetForm } from "../../pass-reset";
import { PATHS } from "../../../app/routes";
import { useAppSelector } from "../../../hooks/redux-ts-helpers";
import { selectCurrentUserProfile } from "../current-user-slice";

function PassResetBox() {
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUserProfile);
  React.useEffect(() => {
    if (user) navigate(PATHS.root);
  });

  return (
    <Box>
      <h1 className="box__header">Password Reset</h1>
      <PassResetForm />
    </Box>
  );
}

export { PassResetBox };
