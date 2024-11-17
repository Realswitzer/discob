import { sendMessage } from "../../../utils";

export function messageKeydownHandler(event: JQuery.KeyDownEvent) {
    switch (event.key) {
        case "Enter":
            if (event.shiftKey) return;
            event.preventDefault()
            sendMessage()
            break;
        default:
            break;
    }
}
