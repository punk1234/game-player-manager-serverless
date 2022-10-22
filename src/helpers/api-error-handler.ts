import * as yup from "yup";
import { ResponseHandler } from ".";
import { default as C } from "../constants";
import { CustomError } from "../exceptions";

/**
 * @function handleApiError
 * @param {Error} err 
 * @returns {*}
 */
export const handleApiError = (err: Error): any => {
  // Logger.error(`[APP ERROR]: ${err}`);
  console.log(`[APP ERROR]: ${err}`);

  if (err instanceof yup.ValidationError || err instanceof SyntaxError) {
    return ResponseHandler.send(
      C.HttpStatusCode.BAD_REQUEST,
      { errors: (err as any).errors },
      err.message,
    );
  }

  if (err instanceof CustomError) {
    return ResponseHandler.send(
      err.statusCode,
      Object.keys(err.metaData).length ? err.metaData : undefined,
      err.message,
    );
  }

  return ResponseHandler.send(
    C.HttpStatusCode.SERVER_ERROR,
    undefined, // NOTE: CAN ALSO USE `{}` HERE, BUT NO NEED TO CREATE MEMORY FOR EMPTY OBJECT
    err.message,
  );
};
