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
var import_http = __toESM(require("http"));
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
  let conn;
  try {
    conn = await pool.getConnection();
    const data = await conn.query(
      "SELECT * FROM discob.messages WHERE RoomID=? ORDER BY ID DESC LIMIT ? OFFSET ?;",
      [room, count, offset]
    );
    return data;
  } catch (err) {
    console.log("Error" + err);
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
var app = (0, import_express.default)();
var server = import_http.default.createServer(app);
var io = new import_socket.Server(server, {
  connectionStateRecovery: {}
});
initializeSocketEvents(io);
app.use(import_express.default.static(__dirname + "/../../client/build/"));
app.get("/messages/:room/:offset/:count", (req, res) => {
  const { room, offset, count } = req.params;
  getMessages(room, Number(count), Number(offset)).then((data) => {
    res.send(data);
  });
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../../client/build/index.html");
});
app.post("/register", (req, res) => {
});
var PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  io
});
