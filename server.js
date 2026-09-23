const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let rooms = {}; 

io.on('connection', (socket) => {
    socket.on('joinRoom', ({ roomCode, username, unoVariant }) => {
        socket.join(roomCode);
        if (!rooms[roomCode]) {
            rooms[roomCode] = {
                variant: unoVariant || 'Classic',
                players: [],
                deck: [],
                discardPile: [],
                currentTurn: 0
            };
        }
        rooms[roomCode].players.push({ id: socket.id, name: username, hand: [] });
        io.to(roomCode).emit('roomUpdate', rooms[roomCode]);
    });

    socket.on('disconnect', () => {
        // Logika pemain keluar
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server UNO berjalan di port ${PORT}`));

