import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'agents',
})
export class AgentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly aiBaseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  private readonly internalToken = process.env.INTERNAL_SERVICE_TOKEN || 'jansankalp-internal-secret-service-token-2026';

  handleConnection(client: Socket) {
    console.log(`[WS-AGENTS] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`[WS-AGENTS] Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { message: string; history?: any[] },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { message, history = [] } = data;

      // Make connection to FastAPI streaming assistant/chat SSE endpoint
      const response = await fetch(`${this.aiBaseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.internalToken}`,
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ message, history, stream: true }),
      });

      if (!response.ok || !response.body) {
        client.emit('chatError', 'Failed to initialize streaming connection with AI engine');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last partial line in buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          if (trimmed.startsWith('data:')) {
            const dataContent = trimmed.substring(5).trim();
            if (dataContent === '[DONE]') {
              client.emit('chatDone');
            } else {
              try {
                // If it is JSON, parse and emit
                const parsed = JSON.parse(dataContent);
                client.emit('chatChunk', parsed);
              } catch (e) {
                // If not JSON, emit raw string
                client.emit('chatChunk', { content: dataContent });
              }
            }
          }
        }
      }

      // Finalize buffer if any content left
      if (buffer.trim()) {
        client.emit('chatChunk', { content: buffer });
      }

      client.emit('chatDone');
    } catch (err) {
      console.error('[WS-AGENTS] Error streaming:', err);
      client.emit('chatError', 'An error occurred during response generation');
    }
  }
}
