import { io } from "socket.io-client";

export const socket = io("https://chat-server-sandy.herokuapp.com");
export let socketID = "";
socket.on("connection", () => {
  socketID = socket.id;
});