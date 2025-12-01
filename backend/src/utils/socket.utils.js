import {io,socketConnectedUser} from "../app.js";
export const sendMessageToUser = (userId, eventName, payload) => {
  const socketId = socketConnectedUser[userId];
  if (socketId) {
    io.to(socketId).emit(eventName, payload);
  } else {
    console.log(`User ${userId} not connected`);
  }
};
