import { appendMessages } from "../../../utils";

export async function loadHandler() {
    await appendMessages("public", 50, 0);
}
