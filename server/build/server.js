var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.ts
var import_express = __toESM(require("express"));
var import_socket = require("socket.io");
var import_config = require("dotenv/config");

// src/utils.ts
var mariadb = __toESM(require("mariadb"));
var pool = mariadb.createPool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});
async function getMessages(room, count, offset) {
  const conn = await pool.getConnection();
  const data = await conn.query("SELECT * FROM discob.messages WHERE RoomID=? ORDER BY ID DESC LIMIT ? OFFSET ?;", [room, count, offset]);
  conn.release();
  return data;
}

// src/index.ts
var PORT = process.env.PORT;
var app = (0, import_express.default)();
var server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
var io = new import_socket.Server(server);
app.use(import_express.default.static(__dirname + "/../../client/build/"));
app.get("/messages/:room/:offset/:count", (req, res) => {
  const { room, offset, count } = req.params;
  getMessages(room, Number(offset), Number(count)).then((data) => {
    res.send(data);
  });
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../../client/build/index.html");
});
