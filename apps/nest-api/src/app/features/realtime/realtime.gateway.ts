import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RealtimeEventDto } from './realtime.dto';
import { RealtimeService } from './realtime.service';

@WebSocketGateway({
  namespace: '/gateway/realtime',
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server?: Server;

  constructor(private readonly realtimeService: RealtimeService) {}

  handleConnection(client: Socket): void {
    client.emit('realtime.history', this.realtimeService.getHistory());
  }

  publishLoanStatusEvent(event: RealtimeEventDto): void {
    this.server?.emit('loan.status.updated', event);
  }
}
