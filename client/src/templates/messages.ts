import { MessageData } from "@backend/types";
import { parseTimestamp } from "../utils";

export const MessageTemplate = (data: MessageData): string => {
    const messageBuilder: string = `
      <span class="break-words text-[18px] text-text whitespace-pre-line">${data.text}</span>`;
    const usernameBuilder: string =
        !data.chained || data.reply
            ? `
      <div class="flex">
        <span class="username text-[20px]" style="color: ${
            data.sender.color
        }">${data.sender.username}</span>
        <span
            class="ml-2 text-[12px] text-subtext-0 justify-center items-center flex"
            >${parseTimestamp(data.timestamp)}</span
        >
      </div>`
            : "";
    const replyBuilder = data.reply
        ? `
      <div class="reply-container">
        <span class="reply-username text" style="color: ${data.reply.color}">${data.reply.username}</span>
          <div class="reply-message-container">
            <span class="reply-message text">${data.reply.text}</span>
          </div>
      </div>`
        : "";
    return (
        `<div class="message flex flex-col py-1 pl-4 hover:bg-base">
        ` +
        replyBuilder +
        usernameBuilder +
        messageBuilder +
        `</div>`
    );
};
