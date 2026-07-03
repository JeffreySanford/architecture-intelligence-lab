import { INestApplication, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';

type SocketIoRedisAdapter = ReturnType<typeof createAdapter>;

export class RedisIoAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private readonly redisAdapter: SocketIoRedisAdapter,
  ) {
    super(app);
  }

  override createIOServer(port: number, options?: ServerOptions): unknown {
    const server = super.createIOServer(port, options);
    server.adapter(this.redisAdapter);

    return server;
  }
}

export async function configureRedisIoAdapter(
  app: INestApplication,
  logger: Logger,
): Promise<void> {
  const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';

  try {
    const pubClient = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 500,
        reconnectStrategy: false,
      },
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    app.useWebSocketAdapter(new RedisIoAdapter(app, createAdapter(pubClient, subClient)));
    logger.log(`Socket.IO Redis adapter connected to ${redisUrl}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Redis adapter error';
    const fallbackMessage = `Socket.IO Redis adapter unavailable; using in-process gateway. ${message}`;

    if (process.env['NODE_ENV'] === 'production') {
      logger.warn(fallbackMessage);
      return;
    }

    logger.log(fallbackMessage);
  }
}
