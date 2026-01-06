import crypto from "crypto";
import path from "path";

export function isFutureTimestamp(timestamp: string) {
  const tsInFuture = new Date(timestamp).getTime();
  const tsNow = new Date().getTime();
  const diff = tsInFuture - tsNow;
  return diff > 0;
}

export function validateScheduleTimestamps(startAt: string, endAt: string) {
  if (!isFutureTimestamp(startAt) || !isFutureTimestamp(endAt)) {
    throw new Error("Timestamps must be in the future");
  } else if (startAt === endAt) {
    throw new Error("Start and end timestamps must be different");
  } else if (new Date(startAt).getTime() > new Date(endAt).getTime()) {
    throw new Error("End timestamp must be later than start timestamp");
  } else {
    return true;
  }
}

export function generateUploadFilename(
  reqFieldname: string,
  originalFilename: string,
) {
  return `${reqFieldname}-${crypto.randomUUID()}${path.extname(originalFilename)}`;
}

export function generateUploadPath(targetPath: string) {
  return path.resolve("/home/node/", targetPath);
}
