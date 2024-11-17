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

  // ../server/src/types.ts
  var UsernameRegex = /[^a-zA-Z0-9]+/g;
  var EmailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

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
  function checkAccountData(data) {
    const { username, password, confirmPassword, email } = data;
    if (!(username && password && confirmPassword && email)) {
      return [false, "Please enter all information" /* EnterInformation */];
    }
    if (UsernameRegex.test(username)) {
      return [false, "Invalid username" /* InvalidUsername */];
    }
    if (!EmailRegex.test(email)) {
      return [false, "Invalid email" /* InvalidEmail */];
    }
    if (confirmPassword != password) {
      return [false, "Passwords do not match" /* PasswordMismatch */];
    }
    return [true, ""];
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

  // src/templates/notification.ts
  var NotificationTemplate = (notification) => {
    const colors = notification.type === "Notice" /* Notice */ ? {
      border: "border-light-blue",
      bg: "bg-blue",
      hover: "hover:bg-dark-blue"
    } : {
      border: "border-maroon",
      bg: "bg-red",
      hover: "hover:bg-dark-red"
    };
    return `<div
        class="notification m-2 h-auto w-64 rounded-md border-2 ${colors.border} ${colors.bg} cursor-pointer ${colors.hover} transition-all"
    >
        <div class="m-2 flex flex-col">
            <div class="flex space-x-1 align-middle">
                <svg
                    class="w-4"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        class="fill-white"
                        fill-rule="evenodd"
                        d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm8-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm.01 8a1 1 0 102 0V9a1 1 0 10-2 0v5z"
                    />
                </svg>
                <span class="font-monospace text-[14px] text-white"
                    >${notification.type}</span
                >
            </div>
            <span class="font-monospace text-[14px] text-white"
                >${notification.message}</span
            >
        </div>
    </div>`;
  };

  // src/lib/classes/notification.ts
  var NotificationMessage = class {
    message;
    type;
    constructor() {
      this.message = "An error has occured";
      this.type = null;
    }
    setMessage(message) {
      this.message = message;
      return this;
    }
    setType(type) {
      this.type = type;
      return this;
    }
    append() {
      const notification = $(NotificationTemplate(this)).css({ opacity: 0 }).appendTo("#notifications").animate({ opacity: 1 }, 300, "linear").on("click", function() {
        $(this).animate({ opacity: 0 }, 300, "linear", function() {
          $(this).remove();
        });
      });
      setTimeout(() => {
        notification.animate({ opacity: 0 }, 300, "linear", function() {
          $(this).remove();
        });
      }, 5e3);
      return this;
    }
  };

  // src/events/listeners/handlers/register.ts
  function registerHandler(event) {
    event.preventDefault();
    const data = {};
    $(this).serializeArray().map((input) => {
      data[input.name] = input.value;
    });
    const [success, message] = checkAccountData(data);
    if (!success) {
      new NotificationMessage().setMessage(message).setType("Error" /* Error */).append();
    } else {
      $.ajax({
        url: "/register",
        method: "POST",
        processData: false,
        data: JSON.stringify(data),
        contentType: "application/json"
      }).then((response) => {
        if (response.error) {
          new NotificationMessage().setMessage(response.error).setType("Error" /* Error */).append();
        } else if (response.email) {
          localStorage.setItem("email", response.email);
          window.location.href = window.location.origin + "/verification";
        }
      });
    }
  }

  // src/events/listeners/handlers/verification.ts
  function verificationHandler(event) {
    event.preventDefault();
    const code = $("input[name=code]").val();
    if (code.trim() === "") {
      new NotificationMessage().setMessage("Please enter a code" /* EnterCode */).setType("Error" /* Error */).append();
      return;
    }
    const email = localStorage.getItem("email");
    if (!email) {
      new NotificationMessage().setType("Error" /* Error */).append();
      return;
    }
    $.ajax({
      url: "/verify",
      method: "POST",
      data: JSON.stringify({
        email,
        code
      }),
      processData: false,
      contentType: "application/json"
    }).then((response) => {
      if (response.error) {
        new NotificationMessage().setMessage(response.error).setType("Error" /* Error */).append();
      } else if (response.success) {
        new NotificationMessage().setMessage(response.success).setType("Notice" /* Notice */).append();
      }
    });
  }

  // src/events/listeners/domListeners.ts
  if ($messages.length) {
    $(window).on("load", async () => {
      await loadHandler();
    }).on("resize", windowResizeHandler);
  }
  $(document).on("keydown", keydownHandler);
  $messageInput.on("keydown", messageKeydownHandler).on("mouseover", messageMouseoverHandler).on("input", refreshNewline);
  $("#send-button").on("click", sendMessage);
  $("#register-form").on("submit", registerHandler);
  $("#verification-form").on("submit", verificationHandler);

  // src/events/socket/message.ts
  socket.on("message" /* Message */, (data) => {
    const date = new Date(data.timestamp);
    new Message().setSender(data.sender.username, data.sender.color).setMessage(data.text).setTimestamp(date).append();
  });
})();
