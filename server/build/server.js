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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  io: () => io
});
module.exports = __toCommonJS(src_exports);
var import_express = __toESM(require("express"));
var import_express_rate_limit = require("express-rate-limit");
var import_path = __toESM(require("path"));
var import_http = __toESM(require("http"));
var import_socket = require("socket.io");
var import_config = require("dotenv/config");

// src/utils.ts
var mariadb = __toESM(require("mariadb"));
var argon2 = __toESM(require("argon2"));
var nodemailer = __toESM(require("nodemailer"));

// src/types.ts
var UsernameRegex = /[^a-zA-Z0-9]+/g;
var EmailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;

// src/utils.ts
var pool = mariadb.createPool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
var transporter = nodemailer.createTransport({
  service: "postfix",
  host: "localhost",
  secure: false,
  port: 25,
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASSWORD },
  tls: { rejectUnauthorized: false }
});
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
async function createAccount(username, password, email) {
  const passwordHash = await argon2.hash(password);
  const verificationCode = generateCode(6);
  let conn;
  try {
    conn = await pool.getConnection();
    const data = await conn.query(
      "INSERT INTO discob.accounts (Username, PasswordHash, Email, IsVerified, ExpirationDate, VerificationCode) VALUES (?, ?, ?, ?, ADDTIME(NOW(), 500), ?);",
      [username, passwordHash, email, false, verificationCode]
    );
    await sendVerificationEmail(email, verificationCode);
    return data;
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
}
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
  if (res.length) {
    return true;
  } else {
    return false;
  }
}
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
  if (res.length) {
    return true;
  } else {
    return false;
  }
}
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
async function sendVerificationEmail(email, code) {
  transporter.sendMail({
    from: process.env.MAIL_SENDER,
    to: email,
    subject: "Discob verification code",
    text: `Your verification code is: ${code}`
  });
}
function generateCode(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
    counter += 1;
  }
  return result;
}
async function getVerificationCode(email) {
  let conn;
  let res = [{ VerificationCode: "" }];
  try {
    conn = await pool.getConnection();
    res = await conn.query(
      "SELECT VerificationCode FROM discob.accounts WHERE Email=?",
      [email]
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  return res[0].VerificationCode;
}
async function checkVerification(email, code) {
  const correctCode = await getVerificationCode(email);
  if (code === correctCode) {
    return [true, "Account successfully verified" /* AccountVerified */];
  } else {
    return [false, "Incorrect code" /* IncorrectCode */];
  }
}
async function verifyAccount(email) {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE LOW_PRIORITY discob.accounts SET IsVerified=1 WHERE Email=?;",
      [email]
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
    socket.on("message" /* Message */, (data) => {
      data.text = data.text.substring(0, 1e3);
      data.timestamp = /* @__PURE__ */ new Date();
      socket.broadcast.emit("message" /* Message */, data);
    });
  });
};

// src/index.ts
var import_cron = require("cron");
var limiter = (0, import_express_rate_limit.rateLimit)({
  windowMs: 1e3 * 60 * 10,
  limit: 15,
  validate: {
    trustProxy: true
  },
  handler: function(req, res) {
    res.send({
      error: "Exceeded rate limit"
    });
  }
});
var app = (0, import_express.default)();
app.set("trust proxy", 1);
var server = import_http.default.createServer(app);
var io = new import_socket.Server(server, {
  connectionStateRecovery: {}
});
new import_cron.CronJob("*/5 * * * *", async () => {
  await deleteExpiredAccounts();
}).start();
initializeSocketEvents(io);
app.use(import_express.default.json());
app.use(import_express.default.static(__dirname + "/../../client/build/"));
app.get("/messages/:room/:offset/:count", (req, res) => {
  const { room, offset, count } = req.params;
  getMessages(room, Number(count), Number(offset)).then((data) => {
    res.send(data);
  });
});
app.get("/account", (req, res) => {
  res.sendFile(import_path.default.resolve(__dirname + "/../../client/build/login.html"));
});
app.get("/verification", (req, res) => {
  res.sendFile(
    import_path.default.resolve(__dirname + "/../../client/build/verification.html")
  );
});
app.post(
  "/register",
  limiter,
  (req, res) => {
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
);
app.post(
  "/verify",
  limiter,
  async (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
      res.send({
        error: "An error has occured" /* Default */
      });
    }
    const [success, message] = await checkVerification(email, code);
    if (success) {
      verifyAccount(email).then(() => {
        res.send({
          success: message
        });
      });
    } else {
      res.send({
        error: message
      });
    }
  }
);
var PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  io
});
