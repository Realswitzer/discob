import { $messageInput } from "../../globals";
import { refreshNewline, sendMessage } from "../../utils";
import {
    keydownHandler,
    messageKeydownHandler,
    messageMouseoverHandler,
    loadHandler,
    windowResizeHandler,
} from "./handlers";

$(window)
    .on("load", async () => {
        await loadHandler();
    })
    .on("resize", windowResizeHandler);

$(document).on("keydown", keydownHandler);

$messageInput
    .on("keydown", messageKeydownHandler)
    .on("mouseover", messageMouseoverHandler)
    .on("input", refreshNewline);

$("#send-button").on("click", sendMessage);
