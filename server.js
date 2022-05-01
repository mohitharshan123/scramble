import { Server } from "socket.io";
import usersHelper from "./helpers/users.js";
import { EVENTS } from "./constants.js";

const { addUser, getUsersInGame, removeUser } = usersHelper;

const io = new Server(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: "*",
  },
});

io.on(EVENTS.socket_connected, (socket) => {
  var user = {};
  socket.on(EVENTS.user_joined, ({ username, gameID }, callback) => {
    const { user: addedUser } = addUser({
      id: socket.id,
      username,
      gameID,
    });
    user = addedUser;

    socket.join(user.gameID);
    socket.emit(EVENTS.user_joined, {
      user: user.username,
    });

    io.to(user.gameID).emit(EVENTS.user_joined, {
      user: user.username,
      text: `${user.username} has joined the game.`,
    });

    io.to(user.gameID).emit(EVENTS.users_in_game, {
      gameID: user.gameID,
      users: getUsersInGame(user.gameID),
    });
    callback();
  });

  socket.on(EVENTS.user_score, ({ user: userToUpdate, score }) => {
    io.to(user.gameID).emit(EVENTS.user_score, {
      user: userToUpdate.username,
      score: score,
      text: `${userToUpdate.username}: ${score}`,
    });
  });

  socket.on(EVENTS.socket_disconnected, () => {
    if (user) {
      removeUser(user.id);
      io.to(user.gameID).emit(EVENTS.user_disconnected, {
        user: user.username,
        text: `${user.username} has left the game.`,
      });
    }
  });
});
