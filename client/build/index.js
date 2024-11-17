(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // external-global-plugin:socket.io-client
  var require_socket = __commonJS({
    "external-global-plugin:socket.io-client"(exports, module) {
      module.exports = io;
    }
  });

  // src/globals.ts
  var $messages = $("#messages");
  var $replyLabel = $("#reply-label");
  var $closeReply = $("#close-reply");
  var $messageInput = $("#message-input");

  // src/events/socket/socketUtil.ts
  var import_socket = __toESM(require_socket());
  var socket = (0, import_socket.io)();

  // src/templates/messages.ts
  var MessageTemplate = (data) => {
    const messageBuilder = `
      <span class="break-words text-[18px] text-text whitespace-pre-line">${data.text}</span>`;
    const usernameBuilder = !data.chained || data.reply ? `
      <div class="flex">
        <span class="username text-[20px]" style="color: ${data.sender.color}">${data.sender.username}</span>
        <span
            class="ml-2 text-[12px] text-subtext-0 justify-center items-center flex"
            >${parseTimestamp(data.timestamp)}</span
        >
      </div>` : "";
    const replyBuilder = data.reply ? `
      <div class="reply-container">
        <span class="reply-username text" style="color: ${data.reply.color}">${data.reply.username}</span>
          <div class="reply-message-container">
            <span class="reply-message text">${data.reply.text}</span>
          </div>
      </div>` : "";
    return `<div class="message flex flex-col py-1 pl-4 hover:bg-base">
        ` + replyBuilder + usernameBuilder + messageBuilder + `</div>`;
  };

  // src/lib/classes/message.ts
  var Message = class {
    text;
    sender;
    timestamp;
    reply;
    chained;
    constructor() {
      this.text = null;
      this.sender = {
        username: null,
        color: null
      };
      this.timestamp = /* @__PURE__ */ new Date();
      this.reply = null;
      this.chained = false;
    }
    prepend() {
      const username = $(".username").first().text();
      if (this.sender.username == username) {
        $(".username").first().parent().remove();
      }
      $(MessageTemplate(this)).data("message-info", this).prependTo("#messages");
      return this;
    }
    append() {
      const username = $(".username").last().text();
      if (this.sender.username == username) {
        this.chained = true;
      }
      $(MessageTemplate(this)).data("message-info", this).appendTo("#messages");
      scrollToBottom();
      return this;
    }
    setMessage(text) {
      this.text = sanitize(text);
      return this;
    }
    setSender(username, color) {
      this.sender.username = sanitize(username);
      this.sender.color = sanitize(color);
      return this;
    }
    setTimestamp(date) {
      this.timestamp = date;
      return this;
    }
    // parseEmoji(): Message {
    //     // this.text = twemoji.parse(this.text, {
    //     //     base: "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/",
    //     // });
    //     return this;
    // }
    setReply(text, username, color) {
      this.reply = {
        username,
        color,
        text
      };
      return this;
    }
    sendMessage() {
      closeReply();
      socket.emit("message" /* Message */, this);
      return this;
    }
  };

  // src/utils.ts
  var tempData = {
    username: "placeholder",
    color: "yellow"
  };
  function sanitize(input) {
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function sendMessage() {
    const message = new Message().setMessage($messageInput.val()).setSender(tempData.username, tempData.color);
    if (message.text.trim().length === 0) return;
    $messageInput.val("");
    refreshNewline();
    message.sendMessage().append();
  }
  function scrollToBottom() {
    $messages.animate({ scrollTop: $messages[0].scrollHeight }, 0);
  }
  function closeReply() {
    $replyLabel.addClass("hidden").removeClass("flex");
    $messageInput.removeClass("stacked");
  }
  function refreshNewline() {
    $messageInput[0].style.height = "0px";
    $messageInput[0].style.height = $messageInput[0].scrollHeight + "px";
  }
  function parseTimestamp(date) {
    const time = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    const today = /* @__PURE__ */ new Date();
    const yesterday = /* @__PURE__ */ new Date();
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
  async function fetchMessages(room, count, offset) {
    const data = await $.ajax({
      url: `/messages/${room}/${offset}/${count}`,
      type: "GET"
    });
    return data;
  }
  async function appendMessages(room, count, offset) {
    const messages = await fetchMessages(room, count, offset);
    messages.reverse().forEach((message) => {
      const date = new Date(Number(message.MessageDate));
      new Message().setMessage(message.MessageText).setSender(message.Username, message.UserColor).setTimestamp(date).append();
    });
  }

  // src/events/listeners/handlers/hoverInput.ts
  function messageMouseoverHandler() {
    $messageInput.trigger("focus");
  }

  // src/events/listeners/handlers/focusInput.ts
  function keydownHandler(event) {
    if (event.altKey || event.ctrlKey) return;
    if (event.key === "Escape") {
      $messageInput.trigger("blur");
      return;
    }
    $messageInput.trigger("focus");
  }

  // src/events/listeners/handlers/messageKeydown.ts
  function messageKeydownHandler(event) {
    switch (event.key) {
      case "Enter":
        if (event.shiftKey) return;
        event.preventDefault();
        sendMessage();
        break;
      default:
        break;
    }
  }

  // src/events/listeners/handlers/loadMessages.ts
  async function loadHandler() {
    if (!$messages.length) return;
    await appendMessages("public", 50, 0);
  }

  // src/events/listeners/handlers/windowResize.ts
  var resizeTimer;
  function windowResizeHandler() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      refreshNewline();
    }, 50);
  }

  // src/events/listeners/domListeners.ts
  $(window).on("load", async () => {
    await loadHandler();
  }).on("resize", windowResizeHandler);
  $(document).on("keydown", keydownHandler);
  $messageInput.on("keydown", messageKeydownHandler).on("mouseover", messageMouseoverHandler).on("input", refreshNewline);
  $("#send-button").on("click", sendMessage);

  // src/events/socket/message.ts
  socket.on("message" /* Message */, (data) => {
    const date = new Date(data.timestamp);
    new Message().setSender(data.sender.username, data.sender.color).setMessage(data.text).setTimestamp(date).append();
  });
})();
