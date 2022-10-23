import { UnauthorizedError } from "../exceptions";

/**
 * @class RoleAccess
 */
export class RoleAccess {
  /**
   * @method checkThatUserIsAuthorized
   * @static
   * @param {boolean} isAdmin
   */
  static checkThatUserIsAuthorized(isAdmin: boolean): void {
    if (isAdmin) {
      return;
    }

    throw new UnauthorizedError("Unauthorized access!");
  }
}
