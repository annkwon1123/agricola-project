import { Server } from 'socket.io';

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io');

    const io = new Server(res.socket.server, {
      path: '/api/socket',
    });

    let playerIdCounter = 1; // 플레이어 ID를 부여할 카운터
    const players = new Map(); // 현재 연결된 플레이어 목록

    io.on('connection', (socket) => {
      console.log('Client connected');

      socket.on("join-room", (room) => {
        socket.join(room);

        // 플레이어 ID를 할당하고 소켓에 저장
        const playerId = playerIdCounter;
        socket.playerId = playerId; // 소켓에 playerId를 저장
        socket.emit('assignId', playerId);
        players.set(socket.id, playerId);
        playerIdCounter = (playerIdCounter % 4) + 1; // ID를 1, 2, 3, 4로 순환

        console.log(`Player ${playerId} connected. Total players: ${players.size}`);

        // 4명이 모두 모이면 게임 시작 신호를 보냄
        if (players.size === 4) {
          io.emit('startGame');
        }
      });

      socket.on('disconnect', () => {
        const playerId = socket.playerId; // 소켓에서 playerId를 가져옴
        console.log(`Player ${playerId} disconnected`);
        // 플레이어 목록에서 제거
        players.delete(socket.id);
      });

      socket.on('sendMessage', (msg) => {
        io.emit('receiveMessage', msg);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;