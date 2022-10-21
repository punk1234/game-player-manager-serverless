import bcrypt from "bcryptjs";

/**
 * @class PasswordHasher
 */
export class PasswordHasher {
    /**
     * @name hash
     * @static
     * @memberof PasswordHasher
     * @param plainTextPasword
     * @returns
     */
    static hash(plainTextPasword: string) {
        if (!plainTextPasword) {
            throw new Error("Invalid plain-text password");
        }

        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(plainTextPasword, salt);
    }

    /**
     * @name verify
     * @static
     * @memberof PasswordHasher
     * @param plainTextPasword
     * @param hashedPassword
     * @returns
     */
    static verify(plainTextPasword: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(plainTextPasword, hashedPassword);
    }
}
