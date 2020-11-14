const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = 3000;

app.get("", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/javascript", (req, res) => {
  res.sendFile(__dirname + "/public/javascript.html");
});

app.get("/swift", (req, res) => {
  res.sendFile(__dirname + "/public/swift.html");
});

app.get("/css", (req, res) => {
  res.sendFile(__dirname + "/public/css.html");
});

//namespace
const tech = io.of("/tech");

tech.on("connection", (socket) => {
  socket.on("join", ({ msg, room }) => {
    socket.join(room);
    tech.in(room).emit("message", `New user joined the ${room} room`);
  });

  socket.on("message", ({ msg, room }) => {
    console.log(`message: ${msg} to ${room} room`);
    tech.in(room).emit("message", msg);
  });

  socket.on("disconnect", ({ msg, room }) => {
    console.log(`user disconnected from ${room} room`);
    tech.in(room).emit("message", "user disconnected!");
  });
});

server.listen(port, () => {
  console.log(`Server is running on port 3000`);
});
