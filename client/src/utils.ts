import {
    DatabaseMessage,
    StatusMessage,
    UsernameRegex,
    EmailRegex,
} from "@backend/types";
import { $messages } from "./globals";
import { Message } from "./lib/message";
import { $messageInput, $replyLabel } from "./globals";
import { LoginData, RegisterData } from "./types";

export function sanitize(input: string): string {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function sendMessage() {
    const message: Message = new Message()
        .setMessage($messageInput.val() as string)
        .setSender(localStorage.getItem("username"), "white")
        .setToken(localStorage.getItem("token"));
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

export async function prependMessages(
    room: string,
    count: number,
    offset: number
) {
    const messages = await fetchMessages(room, count, offset);
    messages.forEach((message) => {
        const date = new Date(Number(message.MessageDate));
        new Message()
            .setMessage(message.MessageText)
            .setSender(message.Username, message.UserColor)
            .setTimestamp(date)
            .prepend();
    });

    return messages;
}

export function checkAccountData(data: RegisterData): [boolean, string] {
    const { username, password, confirmPassword, email } = data;
    if (!username || !password || !confirmPassword || !email) {
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

export function checkLoginData(data: LoginData): [boolean, string] {
    const { username, password } = data;
    if (!username || !password) {
        return [false, StatusMessage.EnterInformation];
    }
    return [true, ""];
}

export function applyMarkdown(text: string) {
    const sections = text.split(/(`[^\`]+`)/g);
    sections.forEach((section: string, index: number) => {
        if (section.endsWith("`") && section.startsWith("`")) {
            sections[index] = `<code>${section.slice(1, -1)}</code>`;
        }
    });
    return sections
        .join("")
        .replace(/\*{3}([^\*]+)\*{3}/g, "<b><i>$1</i></b>")
        .replace(/\*{2}([^\*]+)\*{2}/g, "<b>$1</b>")
        .replace(/\*{1}([^\*]+)\*{1}/g, "<i>$1</i>")
        .replace(/~{2}([^~]+)~{2}/g, "<strike>$1</strike>")
        .replace(/(https?:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>")
        .replace(/#{3}\s(.+)/g, "<h3>$1")
        .replace(/#{2}\s(.+)/g, "<h2>$1")
        .replace(/#{1}\s(.+)/g, "<h1>$1");
}
