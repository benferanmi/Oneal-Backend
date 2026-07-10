import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { AppError } from "../utils/errors";

type Source = "body" | "query" | "params";

export function validate(schema: ObjectSchema, source: Source = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      return next(
        AppError.validation(
          "Validation failed",
          error.details.map((d) => ({ path: d.path.join("."), message: d.message }))
        )
      );
    }
    // Only reassign body/params; leave query alone (Express 5 makes req.query
    // a getter that throws on assignment).
    if (source !== "query") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any)[source] = value;
    } else {
      // Merge validated values back onto req.query in place.
      for (const key of Object.keys(value)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req.query as any)[key] = value[key];
      }
    }
    next();
  };
}
