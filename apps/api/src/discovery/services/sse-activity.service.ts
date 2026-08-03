import type { Response } from 'express';

interface SSEClient {
  id: string;
  res: Response;
}

class SSEActivityManager {
  private clients: SSEClient[] = [];

  public addClient(id: string, res: Response): void {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const client: SSEClient = { id, res };
    this.clients.push(client);

    // Send initial heartbeat
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE Stream connected' })}\n\n`);

    res.on('close', () => {
      this.clients = this.clients.filter((c) => c.id !== id);
    });
  }

  public broadcastEvent(event: { type: string; payload: unknown }): void {
    const dataString = `data: ${JSON.stringify(event)}\n\n`;
    this.clients.forEach((client) => {
      try {
        client.res.write(dataString);
      } catch {
        // Ignore dead sockets
      }
    });
  }
}

export const sseActivityManager = new SSEActivityManager();
