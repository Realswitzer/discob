import {
    DatabaseMessage,
    User,
    StatusMessage,
    UsernameRegex,
    EmailRegex,
} from "@backend/types";
import { $messages } from "./globals";
import { Message } from "./lib/classes/message";
import { $messageInput, $replyLabel } from "./globals";
import { RegisterData } from "./types";

//TEMP
export const tempData: User = {
    username: "placeholder",
    color: "yellow",
};

export function sanitize(input: string): string {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function sendMessage() {
    const message: Message = new Message()
        .setMessage($messageInput.val() as string)
        .setSender(tempData.username, tempData.color);
    if (message.text.trim().length === 0) return;
    $messageInput.val("");
    refreshNewline();

    // if (isReply) {
    //     message.setReply(
    //         replyData.text,
    //         replyData.username,
    //         replyData.color
    //     );
    //     isReply = false;
    // }

    message.sendMessage().append();
}

export function scrollToBottom() {
    $messages.animate({ scrollTop: $messages[0].scrollHeight }, 0);
}

export function closeReply() {
    $replyLabel.addClass("hidden").removeClass("flex");
    $messageInput.removeClass("stacked");
}

export function openReply() {
    $replyLabel.removeClass("hidden").addClass("flex");
    $messageInput.addClass("stacked");
}

export function refreshNewline() {
    $messageInput[0].style.height = "0px";
    $messageInput[0].style.height = $messageInput[0].scrollHeight + "px";
}

/**
 * Parse timestamp into string based on date
 *
 * @export
 * @param {Date} date
 * @return parsed timestamp
 */
export function parseTimestamp(date: Date): string {
    const time = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    switch (date.toDateString()) {
        case today.toDateString():
            return `Today at ${time}`;
        case yesterday.toDateString():
            return `Yesterday at ${time}`;
        default:
            return `${date.toLocaleDateString()} ${time}`;
    }
}

/**
 * Fetch messages from server using roomID, count, and offset
 *
 * @export
 * @param {string} room
 * @param {number} count
 * @param {number} offset
 */
export async function fetchMessages(
    room: string,
    count: number,
    offset: number
) {
    const data: DatabaseMessage[] = await $.ajax({
        url: `/messages/${room}/${offset}/${count}`,
        type: "GET",
    });
    return data;
}

/**
 * Load and append messages
 *
 * @export
 * @param {string} room
 * @param {number} count
 * @param {number} offset
 */
export async function appendMessages(
    room: string,
    count: number,
    offset: number
) {
    const messages = await fetchMessages(room, count, offset);
    messages.reverse().forEach((message) => {
        const date = new Date(Number(message.MessageDate));
        new Message()
            .setMessage(message.MessageText)
            .setSender(message.Username, message.UserColor)
            .setTimestamp(date)
            .append();
    });
}

export function checkAccountData(data: RegisterData): [boolean, string] {
    const { username, password, confirmPassword, email } = data;
    if (!(username && password && confirmPassword && email)) {
        return [false, StatusMessage.EnterInformation];
    }
    if (UsernameRegex.test(username)) {
        return [false, StatusMessage.InvalidUsername];
    }
    if (!EmailRegex.test(email)) {
        return [false, StatusMessage.InvalidEmail];
    }
    if (confirmPassword != password) {
        return [false, StatusMessage.PasswordMismatch];
    }
    return [true, ""];
}