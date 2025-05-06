import { io, Socket } from 'socket.io-client';

export class Emo{
  protected socket: Socket;
  constructor() {
    this.socket = io('http://localhost:88'); // Cambiar por tu backend
  }

}
