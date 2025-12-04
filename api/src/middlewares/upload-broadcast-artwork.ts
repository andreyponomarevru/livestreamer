import { NextFunction, Request, Response } from "express";
import multer from "multer";

import {
  UPLOADED_BROADCAST_ARTWORKS_IMG_DIR,
  UPLOADED_MISC_DIR,
} from "../config/env";
import { HttpError } from "../utils/http-error";
import { generateUploadFilename } from "../utils/utils";

const broadcastArtworkUploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(
        null,
        file.fieldname === "artwork"
          ? UPLOADED_BROADCAST_ARTWORKS_IMG_DIR
          : UPLOADED_MISC_DIR,
      );
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (err: Error | null, filename: string) => void,
    ) => cb(null, generateUploadFilename(file.fieldname, file.originalname)),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("artwork");

export function uploadBroadcastArtwork({
  isFileRequired = true,
}: {
  isFileRequired: boolean;
}) {
  return function (req: Request, res: Response, next: NextFunction) {
    broadcastArtworkUploader(req, res, (err) => {
      if (isFileRequired && !req.file) {
        next(
          new HttpError({
            code: 400,
            message: "Artwork is required. Please upload the file.",
          }),
        );
      } else if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          next(
            new HttpError({
              code: 400,
              message:
                "The file size exceeds the limit 10MB. Please upload a smaller file.",
            }),
          );
        } else {
          next(err);
        }
      } else {
        next();
      }
    });
  };
}
