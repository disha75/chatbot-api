const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const TYPING_STATUS = 'typingStatus';

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  // Join a conversation
  const { chatId } = socket.handshake.query;
  socket.join(chatId);
  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(chatId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(chatId);
  });
  socket.on(TYPING_STATUS,(data)=>{
    io.in(chatId).emit(TYPING_STATUS, data);
  })
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
