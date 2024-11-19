import * as argon2 from "argon2";
import { StatusMessage } from "../../types";
import { checkIfVerified } from "../db/checkIfVerified";
import { getVerificationCode } from "../db/getVerificationCode";

export async function checkVerification(
    email: string,
    code: string
): Promise<[boolean, string]> {
    const isAlreadyVerified = await checkIfVerified(email);
    const correctCode = await getVerificationCode(email);
    if (isAlreadyVerified) {
        return [false, StatusMessage.AccountAlreadyVerified];
    }
    if (await argon2.verify(correctCode, code)) {
        return [true, StatusMessage.AccountVerified];
    }
    return [false, StatusMessage.IncorrectCode];
}
