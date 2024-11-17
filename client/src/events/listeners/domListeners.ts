import { $messageInput, $messages } from "../../globals";
import { refreshNewline, sendMessage } from "../../utils";
import {
    keydownHandler,
    messageKeydownHandler,
    messageMouseoverHandler,
    loadHandler,
    windowResizeHandler,
    registerHandler,
    verificationHandler,
} from "./handlers";

if ($messages.length) {
    $(window)
        .on("load", async () => {
            await loadHandler();
        })
        .on("resize", windowResizeHandler);
}

$(document).on("keydown", keydownHandler);

$messageInput
    .on("keydown", messageKeydownHandler)
    .on("mouseover", messageMouseoverHandler)
    .on("input", refreshNewline);

$("#send-button").on("click", sendMessage);

$("#register-form").on("submit", registerHandler);

$("#verification-form").on("submit", verificationHandler);
