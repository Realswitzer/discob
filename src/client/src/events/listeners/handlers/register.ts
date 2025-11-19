import { NotificationMessage } from "../../../lib/notification";
import { Status } from "../../../types";
import { checkAccountData } from "../../../utils";
import { UserData } from "@backend/types";

export function registerHandler(event: JQuery.SubmitEvent) {
    event.preventDefault();
    const data: any = {};
    $(this)
        .serializeArray()
        .map((input) => {
            data[input.name] = input.value;
        });

    const [success, message] = checkAccountData(data);
    if (!success) {
        new NotificationMessage()
            .setMessage(message)
            .setType(Status.Error)
            .append();
    } else {
        $.ajax({
            url: "/register",
            method: "POST",
            processData: false,
            data: JSON.stringify(data),
            contentType: "application/json",
        }).then(
            (response: { error?: string; userData?: UserData | null }) => {
                if (response.error) {
                    new NotificationMessage()
                        .setMessage(response.error)
                        .setType(Status.Error)
                        .append();
                } else if (response.userData) {
                    const { username, token } = response.userData;
                    localStorage.setItem("username", username);
                    localStorage.setItem("token", token);
                    window.location.href = window.location.origin;
                }
            }
        );
    }
}
