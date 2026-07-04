import { INestApplication, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';

type SocketIoRedisAdapter = ReturnType<typeof createAdapter>;

export type RedisAdapterStatus = {
  mode: 'redis' | 'in-process' | 'unknown';
  connected: boolean;
  redisUrl: string | null;
  message: string;
};

const redisAdapterStatus: RedisAdapterStatus = {
  mode: 'unknown',
  connected: false,
  redisUrl: null,
  message: 'Socket.IO Redis adapter not initialized.',
};

export function getRedisAdapterStatus(): RedisAdapterStatus {
  return redisAdapterStatus;
}

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
    redisAdapterStatus.mode = 'redis';
    redisAdapterStatus.connected = true;
    redisAdapterStatus.redisUrl = redisUrl;
    redisAdapterStatus.message = `Socket.IO Redis adapter connected to ${redisUrl}`;
    logger.log(redisAdapterStatus.message);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Redis adapter error';
    const fallbackMessage = `Socket.IO Redis adapter unavailable; using in-process gateway. ${message}`;

    redisAdapterStatus.mode = 'in-process';
    redisAdapterStatus.connected = false;
    redisAdapterStatus.redisUrl = redisUrl;
    redisAdapterStatus.message = fallbackMessage;

    if (process.env['NODE_ENV'] === 'production') {
      logger.warn(fallbackMessage);
      return;
    }

    logger.log(fallbackMessage);
  }
}
