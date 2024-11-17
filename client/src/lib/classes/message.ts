import { socket } from "../../events/socket/socketUtil"
import { MessageTemplate } from "../../templates/messages";
import { closeReply, scrollToBottom } from "../../utils";
import { sanitize } from "../../utils";
import { Reply, Events } from "@backend/types";
import { $messages } from "../../globals";
// import { emojis } from "../assets/emoji";
// import twemoji from "twemoji";

export class Message {
    text: string | null;
    sender: {
        username: string | null;
        color: string | null;
    };
    timestamp: Date;
    reply: null | Reply;
    chained: boolean;

    constructor() {
        this.text = null;
        this.sender = {
            username: null,
            color: null,
        };
        this.timestamp = new Date();
        this.reply = null;
        this.chained = false;
    }

    prepend(): Message {
        const username = $(".username").first().text();
        if (this.sender.username == username) {
            $(".username").first().parent().remove();
        }

        $(MessageTemplate(this))
            .data("message-info", this)
            .prependTo("#messages");

        return this;
    }

    append(): Message {
        const username = $(".username").last().text();
        if (this.sender.username == username) {
            this.chained = true;
        }

        $(MessageTemplate(this))
            .data("message-info", this)
            .appendTo("#messages");

        scrollToBottom();

        return this;
    }

    setMessage(text: string): Message {
        // const matches = text.match(/:[a-z0-9A-Z_]+:/g);
        // if (matches) {
        //     matches.forEach((match) => {
        //         const emoji = emojis[match.slice(1, -1)];
        //         if (emoji) {
        //             text = text.replace(match, emoji);
        //         }
        //     });
        // }
        this.text = sanitize(text);

        return this;
    }

    setSender(username: string, color: string): Message {
        this.sender.username = sanitize(username);
        this.sender.color = sanitize(color);

        return this;
    }

    setTimestamp(date: Date) {
        this.timestamp = date;

        return this;
    }

    // parseEmoji(): Message {
    //     // this.text = twemoji.parse(this.text, {
    //     //     base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
    //     // });

    //     return this;
    // }

    setReply(text: string, username: string, color: string): Message {
        this.reply = {
            username: username,
            color: color,
            text: text,
        };

        return this;
    }

    sendMessage(): Message {
        closeReply();

        socket.emit(Events.Message, this);

        return this;
    }
}
