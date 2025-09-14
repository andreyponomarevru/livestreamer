import { type FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { type APIError, type ChatMsg, type User } from "../types";
import { RESOURCES, PERMISSIONS } from "../config/constants";

export function getRTKQueryErr(err: unknown): string {
  function isFetchBaseQueryError(err: unknown): err is FetchBaseQueryError {
    return typeof err === "object" && err !== null && "status" in err;
  }

  function isErrorWithMessage(err: unknown): err is { message: string } {
    return (
      typeof err === "object" &&
      err !== null &&
      "message" in err &&
      typeof err.message === "string"
    );
  }

  if (isFetchBaseQueryError(err)) {
    const errMsg =
      "error" in err ? err.error : (err as unknown as APIError).message;
    return errMsg;
  } else if (isErrorWithMessage(err)) {
    return err.message;
  } else {
    return "Unknown type of error";
  }
}

export async function handleResponseErr(
  err: Response
): Promise<APIError | Error> {
  const contentType = err.headers.get("content-type");

  if (contentType && contentType.indexOf("application/json") !== -1) {
    const json: APIError = await err.json();
    return json;
  } else {
    const parsedErr = new Error(`${err.status} — ${err.statusText}`);
    return parsedErr;
  }
}

interface HasPermission {
  action: (typeof PERMISSIONS)[number];
  resource: (typeof RESOURCES)[number];
}

export function hasPermission(
  checkPermission: HasPermission,
  user?: User | null
): boolean {
  const isAuthenticated = !!user;
  const hasPermission = !!(
    user?.permissions?.[checkPermission.resource] &&
    user.permissions[checkPermission.resource]?.includes(checkPermission.action)
  );

  return isAuthenticated && hasPermission;
}

export function isEmail(string: string) {
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(string);
}

export type ParsedResponse<T> = {
  status: number;
  body: T | null;
};

export async function parseResponse<T>(
  response: Response
): Promise<ParsedResponse<T>> {
  const contentType = response.headers.get("content-type");

  // console.log("[parseResponse] ", response);

  if (contentType && contentType.indexOf("application/json") !== -1) {
    if (response.ok) {
      return { body: await response.json(), status: response.status };
    } else {
      throw response;
    }
  } else {
    if (response.ok) {
      return { body: null, status: response.status };
    } else {
      throw response;
    }
  }
}

export function sortMessages(a: ChatMsg, b: ChatMsg): number {
  return a.id - b.id;
}
