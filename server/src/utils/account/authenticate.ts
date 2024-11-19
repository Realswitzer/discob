import { StatusMessage } from "../../types";
import { getAccountPassword } from "../db/getAccountPassword";
import * as argon2 from "argon2";

export async function authenticateUser(
    username: string,
    password: string
): Promise<[boolean, string]> {
    const passwordHash = await getAccountPassword(username);
    if (!passwordHash) {
        return [false, StatusMessage.AccountNotFound];
    }
    if (!(await argon2.verify(passwordHash, password))) {
        return [false, StatusMessage.IncorrectPassword];
    }
    return [true, ""];
}
