import * as React from "react";
import { useForm } from "react-hook-form";

import { inputRules, type InputTypes } from "../../../config/input-rules";
import { Btn } from "../btn/btn-component";
import { FormError } from "../form-error/form-error-component";
import { Loader } from "../loader/loader-component";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";

export function PlayerLinkForm() {
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
        message: String(saveLinkResponse.error),
      });
    }
  }, [isMounted, saveLinkResponse]);

  return (
    <form
      className="archive-item-controls__form-group"
      onSubmit={handleSubmit(handleSavePlayerLink, handleErrors)}
      onChange={handleChange}
    >
      <label className="form__label" htmlFor="player-link" />
      <div className="archive-item-controls__grouped-btns">
        <input
          id="player-link"
          type="text"
          className="text-input"
          placeholder="Player Link (Mixcloud, Soundcloud, ...)"
          {...register("playerLink", inputRules.playerLink)}
        />

        <Btn theme="primary">
          Save Link
          <Loader />
        </Btn>
      </div>
      {errors.playerLink && <FormError>{errors.playerLink.message}</FormError>}
    </form>
  );
}
