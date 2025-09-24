import React from "react";

import { useForm } from "react-hook-form";

import { inputRules, type InputTypes } from "../../../config/input-rules";
import { Btn } from "../btn/btn-component";
import { Loader } from "../loader/loader-component";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { useFetch } from "../../../hooks/use-fetch";
import { FormError } from "../form-error/form-error-component";

export function TracklistForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<InputTypes>({ mode: "onBlur" });

  async function handleUploadTracklist(data: unknown) {
    clearErrors();
    // TODO:
    // sendUploadTracklistRequest(data)
    // example of file uploading: https://stackoverflow.com/questions/64357440/files-not-getting-uploaded-from-react-hook-forms-to-backend-server
    // + https://www.newline.co/@satansdeer/handling-file-fields-using-react-hook-form--93ebef46
  }

  function handleErrors(errors: unknown) {
    console.error(errors);
  }

  function handleChange() {
    clearErrors();
  }

  const isMounted = useIsMounted();
  const {
    state: uploadTracklistResponse,
    fetchNow: sendUploadTracklistRequest,
  } = useFetch();
  React.useEffect(() => {
    if (isMounted && uploadTracklistResponse.error) {
      setError("tracklist", {
        type: "string",
        message: String(uploadTracklistResponse.error),
      });
    }
  }, [isMounted, uploadTracklistResponse]);

  return (
    <form
      className="archive-item-controls__form-group"
      onSubmit={handleSubmit(handleUploadTracklist, handleErrors)}
      onChange={handleChange}
    >
      <label htmlFor="tracklist">Tracklist</label>
      <div className="archive-item-controls__grouped-btns">
        <input
          id="tracklist"
          type="file"
          accept="image/*"
          {...register("tracklist", inputRules.tracklist)}
        />

        <Btn theme="primary" isLoading={uploadTracklistResponse.isLoading}>
          Save Tracklist <Loader />
        </Btn>
      </div>
      {/* Use 'any' as temporarily fix for 'react-hook-form' error. 
      Details: https://github.com/react-hook-form/react-hook-form/issues/987 */}
      {errors.tracklist && (
        <FormError>{(errors.tracklist as any).message}</FormError>
      )}
    </form>
  );
}
