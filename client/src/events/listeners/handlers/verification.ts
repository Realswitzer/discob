import { StatusMessage, UserData } from "@backend/types";
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
    }).then(
        (response: {
            error: string | null;
            success: string | null;
            userData: UserData | null;
        }) => {
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
                const { token, username } = response.userData;
                console.log(token, username);
                localStorage.removeItem("email");
                localStorage.setItem("token", token);
                localStorage.setItem("username", username);
                setTimeout(() => {
                    window.location.href = window.location.origin;
                }, 1500);
            }
        }
    );
}
