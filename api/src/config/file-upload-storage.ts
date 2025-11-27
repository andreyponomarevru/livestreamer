import path from "path";
import { randomUUID } from "crypto";

import multer from "multer";

import {
  UPLOADED_PROFILE_PICS_IMG_DIR,
  UPLOADED_BROADCAST_ARTWORKS_IMG_DIR,
  UPLOADED_MISC_DIR,
} from "./env";

export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      let uploadPath = "";

      switch (file.fieldname) {
        case "artwork": {
          uploadPath = UPLOADED_BROADCAST_ARTWORKS_IMG_DIR;
          break;
        }
        case "profilepic": {
          uploadPath = UPLOADED_PROFILE_PICS_IMG_DIR;
          break;
        }
        default:
          uploadPath = UPLOADED_MISC_DIR;
      }

      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      const newFilename = `${file.fieldname}-${randomUUID()}${path.extname(file.originalname)}`;
      cb(null, newFilename);
    },
  }),
});
