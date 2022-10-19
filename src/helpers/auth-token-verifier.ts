import { JwtHelper } from ".";
import { IAuthTokenPayload } from "../interfaces";
import { UnauthenticatedError } from "../exceptions";

/**
 * @function verifyAuthToken
 * @param {Record<string, any>} headers
 * @returns {IAuthTokenPayload}
 */
export const verifyAuthToken = (headers: Record<string, any>): IAuthTokenPayload => {
  const authHeader = headers["authorization"];

  const authToken = _checkThatValidTokenFormatIsProvided(authHeader);
  const authPayload = JwtHelper.verifyToken(authToken);

  return authPayload as IAuthTokenPayload;
}

/**
 * @function _checkThatValidTokenFormatIsProvided
 * @param {string|undefined} authToken 
 * @returns {string} auth token
 */
const _checkThatValidTokenFormatIsProvided = (authToken: string|undefined): string => {
  let splitToken;

  if (
    !authToken ||
    (splitToken = authToken.split(" ")).length !== 2 ||
    splitToken[0].toLowerCase() !== "bearer" ||
    !splitToken[1]
  ) { throw new UnauthenticatedError("Invalid token!"); }

  return splitToken[1];
}