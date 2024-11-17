import { $messageInput } from "../../../globals";

export function keydownHandler(event: JQuery.KeyDownEvent) {
    if (event.altKey || event.ctrlKey) return;
    if (event.key === "Escape") {
        $messageInput.trigger("blur");
        return;
    }
    $messageInput.trigger("focus");
}
