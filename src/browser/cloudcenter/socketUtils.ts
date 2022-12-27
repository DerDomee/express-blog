import {io} from 'socket.io-client';

export const socket = io({
	autoConnect: false,
});

socket.on('connect', () => {
	console.log(`Connected to websocket with sockID: ${socket.id}`);
});

socket.on('disconnect', () => {
	console.log(`Disconnected from websocket.`);
});

window.derdomee.socket = socket;
