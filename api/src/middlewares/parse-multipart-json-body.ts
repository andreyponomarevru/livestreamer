import { Request, Response, NextFunction } from "express";

export function parseMultipartJSONBody(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];

      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === "object" && parsed !== null) {
            req.body[key] = parsed;
          }
        } catch {
          // not JSON, just a plain string
        }
      }
    });
  }

  next();
}
