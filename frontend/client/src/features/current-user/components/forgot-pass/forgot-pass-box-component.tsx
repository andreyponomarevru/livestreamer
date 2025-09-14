import { Box } from "../../../../features/ui/box/box";
import { ForgotPasswordForm } from "./forgot-pass-form-component";

function ForgotPassBox() {
  return (
    <Box>
      <h1 className="box__header">Forgot Password</h1>
      <ForgotPasswordForm />
    </Box>
  );
}

export { ForgotPassBox };
