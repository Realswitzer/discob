import { EmailRegex, StatusMessage, UsernameRegex } from "../../types";
import { checkEmail } from "../mail/checkEmail";
import { checkUsername } from "./checkUsername";

export async function checkAccountData(
    username: string,
    email: string
): Promise<[boolean, string]> {
    const usernameExists: boolean = await checkUsername(username);
    const emailExists: boolean = await checkEmail(email);
    const isUsernameValid: boolean = UsernameRegex.test(username);
    const isEmailValid: boolean = !EmailRegex.test(email);

    if (usernameExists) {
        return [false, StatusMessage.UsernameTaken];
    }
    if (emailExists) {
        return [false, StatusMessage.EmailTaken];
    }
    if (isUsernameValid) {
        return [false, StatusMessage.InvalidUsername];
    }
    if (isEmailValid) {
        return [false, StatusMessage.InvalidEmail];
    }
    return [true, ""];
}
