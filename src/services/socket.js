import { io } from 'socket.io-client';

// Production Online Live Socket.io WebSockets URL
const SOCKET_URL = 'https://mess-server-fipe.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
