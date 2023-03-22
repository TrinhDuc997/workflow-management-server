const taskSocketControllers = (io, socket) => {
  const updateTask = (params) => {
    socket.broadcast.emit("task-updated", params);
  };
  const createTask = (params) => {
    socket.broadcast.emit("task-created", params);
  };
  const deleteTask = (params) => {
    socket.broadcast.emit("task-deleted", params);
  };
  socket.on("task:update", updateTask);
  socket.on("task:create", createTask);
  socket.on("task:delete", deleteTask);
};
export default taskSocketControllers;
