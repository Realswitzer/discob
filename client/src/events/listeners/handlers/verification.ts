import { StatusMessage } from "@backend/types";
import { NotificationMessage } from "../../../lib/classes/notification";
import { Status } from "../../../types";

export function verificationHandler(event: JQuery.SubmitEvent) {
    event.preventDefault();

    const code: string = $("input[name=code]").val() as string;
    if (code.trim() === "") {
        new NotificationMessage()
            .setMessage(StatusMessage.EnterCode)
            .setType(Status.Error)
            .append();
        return;
    }

    const email: string | null = localStorage.getItem("email");

    if (!email) {
        new NotificationMessage().setType(Status.Error).append();
        return;
    }

    $.ajax({
        url: "/verify",
        method: "POST",
        data: JSON.stringify({
            email: email,
            code: code,
        }),
        processData: false,
        contentType: "application/json",
    }).then((response: { error: string | null; success: string | null }) => {
        if (response.error) {
            new NotificationMessage()
                .setMessage(response.error)
                .setType(Status.Error)
                .append();
        } else if (response.success) {
            new NotificationMessage()
                .setMessage(response.success)
                .setType(Status.Notice)
                .append();
        }
    });
}
