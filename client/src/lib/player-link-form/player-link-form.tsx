import * as React from "react";
import { useForm } from "react-hook-form";

import { inputRules, InputTypes } from "../../config/input-rules";
import { Btn } from "../btn/btn";
import { FormError } from "../form-error/form-error";
import { Loader } from "../loader/loader";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { useFetch } from "../../hooks/use-fetch";

function PlayerLinkForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<InputTypes>({ mode: "onBlur" });

  async function handleSavePlayerLink(data: unknown) {
    clearErrors();
    // TODO:
    // here we submit data to API
    console.log(data);
    // sendSaveLinkRequest(data)
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  function handleChange() {
    clearErrors();
  }

  const isMounted = useIsMounted();
  const { state: saveLinkResponse, fetchNow: sendSaveLinkRequest } = useFetch();
  React.useEffect(() => {
    if (isMounted && saveLinkResponse.error) {
      setError("playerLink", {
        type: "string",
        message: saveLinkResponse.error.message,
      });
    }
  }, [isMounted, saveLinkResponse]);

  return (
    <form
      className="archive-item-controls__form-group"
      onSubmit={handleSubmit(handleSavePlayerLink, handleErrors)}
      onChange={handleChange}
    >
      <label htmlFor="player-link" />
      <div className="archive-item-controls__grouped-btns">
        <input
          id="player-link"
          type="text"
          className="text-input"
          placeholder="Player Link (Mixcloud, Soundcloud, ...)"
          {...register("playerLink", inputRules.playerLink)}
        />

        <Btn theme="white" name="Save Link">
          <Loader for="btn" color="black" />
        </Btn>
      </div>
      {errors.playerLink && <FormError>{errors.playerLink.message}</FormError>}
    </form>
  );
}

export { PlayerLinkForm };
