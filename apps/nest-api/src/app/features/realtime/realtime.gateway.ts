import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { extractPersonaId, isKnownPersonaId, parseAllowedOrigins } from '../../auth/token.utils';
import { RealtimeEventDto } from './realtime.dto';
import { RealtimeService } from './realtime.service';

const socketIoOrigins = parseAllowedOrigins(
  process.env['SOCKET_IO_ORIGINS'] ?? process.env['NEST_API_ORIGINS'],
);

@WebSocketGateway({
  namespace: '/gateway/realtime',
  cors: {
    origin: socketIoOrigins,
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server?: Server;

  constructor(private readonly realtimeService: RealtimeService) {}

  handleConnection(client: Socket): void {
    const personaId = extractPersonaId(client.handshake.headers);
    if (!isKnownPersonaId(personaId)) {
      client.disconnect(true);
      return;
    }

    client.emit('realtime.history', this.realtimeService.getHistory());
  }

  publishLoanStatusEvent(event: RealtimeEventDto): void {
    this.server?.emit('loan.status.updated', event);
  }
}
