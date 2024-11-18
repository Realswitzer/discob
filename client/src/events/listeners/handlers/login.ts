import { NotificationMessage } from "../../../lib/classes/notification";
import { Status } from "../../../types";
import { checkLoginData } from "../../../utils";
import { UserData } from "@backend/types"

export function loginHandler(event: JQuery.SubmitEvent) {
    event.preventDefault();
    const data: any = {};
    $(this)
        .serializeArray()
        .map((input) => {
            data[input.name] = input.value;
        });

    const [success, message] = checkLoginData(data);
    if (!success) {
        new NotificationMessage()
            .setMessage(message)
            .setType(Status.Error)
            .append();
    } else {
        $.ajax({
            url: "/login",
            method: "POST",
            processData: false,
            data: JSON.stringify(data),
            contentType: "application/json",
        }).then((response: { error: string | null; userData: UserData | null }) => {
            if (response.error) {
                new NotificationMessage()
                    .setMessage(response.error)
                    .setType(Status.Error)
                    .append();
            } else if (response.userData) {
                const { username, token } = response.userData
                localStorage.setItem("username", username);
                localStorage.setItem("token", token);
                window.location.href = window.location.origin;
            }
        });
    }
}
