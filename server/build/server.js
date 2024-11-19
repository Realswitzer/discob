var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server.ts
var server_exports = {};
__export(server_exports, {
  io: () => io
});
module.exports = __toCommonJS(server_exports);
var import_socket = require("socket.io");

// src/app.ts
var import_express6 = __toESM(require("express"));

// src/routes/login.ts
var import_express = require("express");

// src/types.ts
var UsernameRegex = /[^a-zA-Z0-9_-]+/g;
var EmailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

// src/utils/db/pool.ts
var mariadb = __toESM(require("mariadb"));
var import_config = require("dotenv/config");
var pool = mariadb.createPool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// src/utils/db/getAccountPassword.ts
async function getAccountPassword(username) {
  let conn;
  let res;
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "SELECT PasswordHash FROM discob.accounts WHERE Username=?",
      [username]
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  return res[0]?.PasswordHash;
}

// src/utils/account/authenticate.ts
var argon2 = __toESM(require("argon2"));
async function authenticateUser(username, password) {
  const passwordHash = await getAccountPassword(username);
  if (!passwordHash) {
    return [false, "Account not found" /* AccountNotFound */];
  }
  if (!await argon2.verify(passwordHash, password)) {
    return [false, "Incorrect password" /* IncorrectPassword */];
  }
  return [true, ""];
}

// src/utils/db/sendAccountData.ts
async function getAccountData(username) {
  let conn;
  let res;
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "SELECT AccountToken, Username FROM discob.accounts WHERE Username=?;",
      [username]
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  return {
    token: res[0]?.AccountToken,
    username: res[0]?.Username
  };
}

// src/controllers/login.ts
async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    res.send({
      error: "An error has occured" /* Default */
    });
  }
  const [success, message] = await authenticateUser(username, password);
  if (success) {
    getAccountData(username).then((userData) => {
      res.send({
        userData
      });
    });
  } else {
    res.send({
      error: message
    });
  }
}

// src/routes/login.ts
var loginRouter = (0, import_express.Router)();
loginRouter.post("/", login);
var login_default = loginRouter;

// src/routes/register.ts
var import_express2 = require("express");

// src/utils/mail/checkEmail.ts
async function checkEmail(email) {
  let conn;
  let res;
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "SELECT Email FROM discob.accounts WHERE Email=?",
      [email]
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  if (res.length && email.length <= 255) {
    return true;
  } else {
    return false;
  }
}

// src/utils/db/checkUsername.ts
async function checkUsername(username) {
  let conn;
  let res;
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "SELECT Username FROM discob.accounts WHERE Username=?",
      [username]
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  if (res.length && username.length <= 20) {
    return true;
  } else {
    return false;
  }
}

// src/utils/db/checkAccountData.ts
async function checkAccountData(username, email) {
  const usernameExists = await checkUsername(username);
  const emailExists = await checkEmail(email);
  const isUsernameValid = UsernameRegex.test(username);
  const isEmailValid = !EmailRegex.test(email);
  if (usernameExists) {
    return [false, "Username already taken" /* UsernameTaken */];
  }
  if (emailExists) {
    return [false, "Email already used" /* EmailTaken */];
  }
  if (isUsernameValid) {
    return [false, "Invalid username" /* InvalidUsername */];
  }
  if (isEmailValid) {
    return [false, "Invalid email" /* InvalidEmail */];
  }
  return [true, ""];
}

// src/utils/db/createAccount.ts
var argon22 = __toESM(require("argon2"));

// src/utils/utility/generateToken.ts
function generateToken(length) {
  let token = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    token += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
    counter += 1;
  }
  return token;
}

// src/utils/mail/transporter.ts
var nodemailer = __toESM(require("nodemailer"));
var import_config2 = require("dotenv/config");
var transporter = nodemailer.createTransport({
  service: "postfix",
  host: "localhost",
  secure: false,
  port: 25,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
  tls: { rejectUnauthorized: false }
});

// src/utils/mail/sendVerificationEmail.ts
async function sendVerificationEmail(email, code) {
  transporter.sendMail({
    from: process.env.MAIL_SENDER,
    to: email,
    subject: "Discob verification code",
    text: `Your verification code is: ${code}`
  });
}

// src/utils/db/createAccount.ts
async function createAccount(username, password, email) {
  const passwordHash = await argon22.hash(password);
  const verificationCode = generateToken(6);
  const verificationCodeHash = await argon22.hash(verificationCode);
  const token = generateToken(100);
  let conn;
  try {
    conn = await pool.getConnection();
    const data = await conn.query(
      "INSERT INTO discob.accounts (Username, PasswordHash, Email, IsVerified, ExpirationDate, VerificationCode, AccountToken) VALUES (?, ?, ?, ?, ADDTIME(NOW(), 500), ?, ?);",
      [username, passwordHash, email, false, verificationCodeHash, token]
    );
    await sendVerificationEmail(email, verificationCode);
    return data;
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
}

// src/controllers/register.ts
async function register(req, res) {
  const { username, password, email } = req.body;
  checkAccountData(username, email).then((response) => {
    const [isValid, message] = response;
    if (isValid) {
      createAccount(username, password, email).then(() => {
        res.send({
          email
        });
      }).catch((err) => {
        res.send({
          error: err
        });
      });
    } else {
      res.send({
        error: message
      });
    }
  }).catch((err) => {
    res.send({
      error: err
    });
  });
}

// src/routes/register.ts
var registerRouter = (0, import_express2.Router)();
registerRouter.post("/", register);
var register_default = registerRouter;

// src/routes/verify.ts
var import_express3 = require("express");

// src/utils/account/checkVerification.ts
var argon23 = __toESM(require("argon2"));

// src/utils/db/checkIfVerified.ts
async function checkIfVerified(email) {
  let conn;
  let res;
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "SELECT IsVerified FROM discob.accounts WHERE Email=? && IsVerified=0;",
      [email]
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  return !res.length;
}

// src/utils/db/getVerificationCode.ts
async function getVerificationCode(email) {
  let conn;
  let res;
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "SELECT VerificationCode FROM discob.accounts WHERE Email=?",
      [email]
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  return res[0].VerificationCode;
}

// src/utils/account/checkVerification.ts
async function checkVerification(email, code) {
  const isAlreadyVerified = await checkIfVerified(email);
  const correctCode = await getVerificationCode(email);
  if (isAlreadyVerified) {
    return [false, "Account already verified" /* AccountAlreadyVerified */];
  }
  if (await argon23.verify(correctCode, code)) {
    return [true, "Account successfully verified" /* AccountVerified */];
  }
  return [false, "Incorrect code" /* IncorrectCode */];
}

// src/utils/db/verifyAccount.ts
async function verifyAccount(email) {
  let conn;
  let res;
  try {
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE LOW_PRIORITY discob.accounts SET IsVerified=1 WHERE Email=?;",
      [email]
    );
    res = await conn.query(
      "SELECT AccountToken, Username FROM discob.accounts WHERE Email=?;",
      [email]
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  return {
    token: res[0]?.AccountToken,
    username: res[0]?.Username
  };
}

// src/controllers/verify.ts
var import_path = __toESM(require("path"));
async function verify3(req, res) {
  const { email, code } = req.body;
  if (!email || !code) {
    res.send({
      error: "An error has occured" /* Default */
    });
  }
  const [success, message] = await checkVerification(email, code);
  if (success) {
    verifyAccount(email).then((userData) => {
      res.send({
        success: message,
        userData
      });
    });
  } else {
    res.send({
      error: message
    });
  }
}
function sendFile(req, res) {
  res.sendFile(
    import_path.default.resolve(__dirname + "/../../client/build/verification.html")
  );
}

// src/routes/verify.ts
var verifyRouter = (0, import_express3.Router)();
verifyRouter.post("/", verify3);
verifyRouter.get("/", sendFile);
var verify_default = verifyRouter;

// src/routes/account.ts
var import_express4 = require("express");

// src/controllers/account.ts
var import_path2 = __toESM(require("path"));
async function sendFile2(req, res) {
  res.sendFile(import_path2.default.resolve(__dirname + "/../../client/build/login.html"));
}

// src/routes/account.ts
var accountRouter = (0, import_express4.Router)();
accountRouter.get("/", sendFile2);
var account_default = accountRouter;

// src/app.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"));

// src/routes/messages.ts
var import_express5 = require("express");

// src/utils/db/getMessages.ts
async function getMessages(room, count, offset) {
  let conn;
  try {
    conn = await pool.getConnection();
    const data = await conn.query(
      "SELECT * FROM discob.messages WHERE RoomID=? ORDER BY ID DESC LIMIT ? OFFSET ?;",
      [room, count, offset]
    );
    return data;
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
}

// src/controllers/messages.ts
async function getMessages2(req, res) {
  const { room, offset, count } = req.params;
  getMessages(room, Number(count), Number(offset)).then((data) => {
    res.send(data);
  });
}

// src/routes/messages.ts
var messagesRouter = (0, import_express5.Router)();
messagesRouter.get("/:room/:offset/:count", getMessages2);
var messages_default = messagesRouter;

// src/app.ts
var app = (0, import_express6.default)();
app.set("trust proxy", 1);
var limiter = (0, import_express_rate_limit.default)({
  windowMs: 1e3 * 60,
  limit: 10,
  validate: {
    trustProxy: true
  },
  handler: function(req, res) {
    res.send({
      error: "Exceeded rate limit" /* ExceededRateLimit */
    });
  }
});
app.use(import_express6.default.json());
app.use(import_express6.default.static(__dirname + "/../../client/build/"));
app.use("/login", limiter, login_default);
app.use("/verify", limiter, verify_default);
app.use("/register", limiter, register_default);
app.use("/account", account_default);
app.use("/messages", messages_default);
var app_default = app;

// src/server.ts
var import_http = __toESM(require("http"));
var import_cron = require("cron");

// src/utils/db/deleteExpiredAccounts.ts
async function deleteExpiredAccounts() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      "DELETE FROM discob.accounts WHERE IsVerified=0 AND TIMESTAMPDIFF(MINUTE, NOW(), ExpirationDate)<0;"
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
}

// src/utils/utility/sanitize.ts
function sanitize(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// src/utils/db/checkTokenValidity.ts
async function isTokenValid(username, token) {
  let conn;
  let res;
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "SELECT AccountToken FROM discob.accounts WHERE Username=?;",
      [username]
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  return res[0]?.AccountToken === token;
}

// src/utils/db/insertMessageData.ts
async function insertMessageData(data) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO discob.messages (ID, RoomID, MessageText, MessageDate, Username, UserColor, Reply) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        0,
        "public",
        data.text,
        Number(data.timestamp).toString(),
        data.sender.username,
        data.sender.color,
        JSON.stringify(data.reply)
      ]
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
}

// src/events/initializeSocket.ts
var initializeSocketEvents = (io2) => {
  io2.on("connection", (socket) => {
    socket.on("message" /* Message */, async (data) => {
      data.text = sanitize(data.text.substring(0, 1e3));
      data.timestamp = /* @__PURE__ */ new Date();
      if (await isTokenValid(data.sender.username, data.token)) {
        socket.broadcast.emit("message" /* Message */, data);
        await insertMessageData(data);
      } else {
        socket.emit("error" /* Error */, "Message failed to send" /* MessageFailed */);
      }
    });
  });
};

// src/server.ts
var import_config3 = require("dotenv/config");
var server = import_http.default.createServer(app_default);
var io = new import_socket.Server(server, {
  connectionStateRecovery: {}
});
initializeSocketEvents(io);
new import_cron.CronJob("*/5 * * * *", async () => {
  await deleteExpiredAccounts();
}).start();
var PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  io
});
