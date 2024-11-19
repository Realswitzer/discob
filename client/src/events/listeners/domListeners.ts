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
    loginHandler,
    scrollHandler,
} from "./handlers";

switch (window.location.pathname) {
    case "/":
        $(window).on("load", loadHandler).on("resize", windowResizeHandler);

        $(document).on("keydown", keydownHandler);

        $messageInput
            .on("keydown", messageKeydownHandler)
            .on("mouseover", messageMouseoverHandler)
            .on("input", refreshNewline);

        $("#send-button").on("click", sendMessage);

        $messages.on("scroll", scrollHandler);
        break;
    case "/account":
        $("#register-form").on("submit", registerHandler);
        $("#login-form").on("submit", loginHandler);
        break;
    case "/verify":
        $("#verification-form").on("submit", verificationHandler);
        break;
    default:
        break;
}
