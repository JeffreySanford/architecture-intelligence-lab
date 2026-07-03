import { Injectable } from '@angular/core';
import { io, type Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class RealtimeSocketService {
  createRealtimeSocket(): Socket {
    return io('/gateway/realtime', {
      transports: ['websocket'],
      autoConnect: false,
      withCredentials: true,
    });
  }
}
