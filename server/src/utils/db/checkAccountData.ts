import { StatusMessage, UsernameRegex } from "../../types";
import { checkUsername } from "./checkUsername";

export async function checkAccountData(
    username: string
): Promise<[boolean, string]> {
    const usernameExists: boolean = await checkUsername(username);
    const isUsernameInvalid: boolean = UsernameRegex.test(username);

    if (usernameExists) {
        return [false, StatusMessage.UsernameTaken];
    }
    if (isUsernameInvalid) {
        return [false, StatusMessage.InvalidUsername];
    }
    return [true, ""];
}
