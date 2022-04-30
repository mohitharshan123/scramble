const users = [];

const addUser = ({ id, username, gameID, score = 0 }) => {
  username = username.trim().toLowerCase();
  gameID = gameID.trim().toLowerCase();
  const existingUser = users.find(
    (user) => user.gameID === gameID && user.username === username
  );
  if (existingUser) {
    return { user: existingUser };
  }
  const user = { id, username, gameID, score };

  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    user.id === id;
  });
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const getUsersInGame = (gameID) =>
  users.filter((user) => user.gameID === gameID);

export default { addUser, removeUser, getUser, getUsersInGame };
