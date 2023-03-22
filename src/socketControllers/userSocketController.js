module.exports = (io, socket) => {
  const updateUser = (params) => {};
  const createUser = (params) => {};
  socket.on("user:update", updateUser);
  socket.on("user:create", createUser);
};
