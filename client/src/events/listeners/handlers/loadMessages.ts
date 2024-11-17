import { $messages } from "../../../globals";
import { appendMessages } from "../../../utils";

export async function loadHandler() {
    if (!$messages.length) return;
    await appendMessages("public", 50, 0);
}
