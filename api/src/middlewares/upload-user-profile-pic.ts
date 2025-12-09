import { NextFunction, Request, Response } from "express";
import multer from "multer";

import { UPLOADED_PROFILE_PICS_IMG_DIR } from "../config/env";
import { HttpError } from "../utils/http-error";
import { generateUploadFilename, generateUploadPath } from "../utils/utils";

const FIELDNAME = "profilepic";

const userProfilePicUploader = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, generateUploadPath(UPLOADED_PROFILE_PICS_IMG_DIR));
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (err: Error | null, filename: string) => void,
    ) => cb(null, generateUploadFilename(file.fieldname, file.originalname)),
  }),
  limits: { fileSize: 3 * 1024 * 1024 },
}).single(FIELDNAME);

export function uploadUserProfilePic(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  userProfilePicUploader(req, res, (err) => {
    if (!req.file) {
      next(
        new HttpError({
          code: 400,
          message: "User profile pic is required. Please upload the file.",
        }),
      );
    } else if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        next(
          new HttpError({
            code: 400,
            message:
              "The file size exceeds the limit 3MB. Please upload a smaller file.",
          }),
        );
      } else {
        next(err);
      }
    } else {
      next();
    }
  });
}
