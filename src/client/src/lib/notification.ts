import { NotificationTemplate } from "../templates/notification";
import { Status } from "../types";

export class NotificationMessage {
    message: string;
    type: Status | null;

    constructor() {
        this.message = "An error has occured";
        this.type = null;
    }

    setMessage(message: string) {
        this.message = message;

        return this;
    }

    setType(type: Status) {
        this.type = type;

        return this;
    }

    append() {
        const notification = $(NotificationTemplate(this))
            .css({ opacity: 0 })
            .appendTo("#notifications")
            .animate({ opacity: 1 }, 300, "linear")
            .on("click", function () {
                $(this).animate({ opacity: 0 }, 300, "linear", function () {
                    $(this).remove();
                });
            });

        setTimeout(() => {
            notification.animate({ opacity: 0 }, 300, "linear", function () {
                $(this).remove();
            });
        }, 5000);

        return this;
    }
}
