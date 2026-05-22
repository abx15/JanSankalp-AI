import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AgentsService {
  private readonly aiBaseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  private readonly internalToken = process.env.INTERNAL_SERVICE_TOKEN || 'jansankalp-internal-secret-service-token-2026';

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.internalToken}`,
    };
  }

  async chat(message: string, history: any[]) {
    try {
      const resp = await fetch(`${this.aiBaseUrl}/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message, history }),
      });

      if (!resp.ok) {
        throw new Error(`AI service responded with status ${resp.status}`);
      }

      return await resp.json();
    } catch (err) {
      console.error('[AGENTS-SERVICE] Chat failed:', err);
      throw new InternalServerErrorException('AI chat service is temporarily unavailable');
    }
  }

  async classify(text: string) {
    try {
      const resp = await fetch(`${this.aiBaseUrl}/classify`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ text }),
      });

      if (!resp.ok) {
        throw new Error(`AI service responded with status ${resp.status}`);
      }

      return await resp.json();
    } catch (err) {
      console.error('[AGENTS-SERVICE] Classify failed:', err);
      throw new InternalServerErrorException('AI classification service is temporarily unavailable');
    }
  }

  async checkDuplicate(text: string, latitude: number, longitude: number) {
    try {
      const resp = await fetch(`${this.aiBaseUrl}/duplicate-check`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ text, latitude, longitude }),
      });

      if (!resp.ok) {
        throw new Error(`AI service responded with status ${resp.status}`);
      }

      return await resp.json();
    } catch (err) {
      console.error('[AGENTS-SERVICE] Duplicate check failed:', err);
      throw new InternalServerErrorException('AI duplicate checking is temporarily unavailable');
    }
  }

  async checkSpam(text: string) {
    try {
      const resp = await fetch(`${this.aiBaseUrl}/spam-check`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ text }),
      });

      if (!resp.ok) {
        throw new Error(`AI service responded with status ${resp.status}`);
      }

      return await resp.json();
    } catch (err) {
      console.error('[AGENTS-SERVICE] Spam check failed:', err);
      throw new InternalServerErrorException('AI spam analysis is temporarily unavailable');
    }
  }

  async processWorkflow(complaintId: string, text: string, latitude: number, longitude: number) {
    try {
      const resp = await fetch(`${this.aiBaseUrl}/process-workflow`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ complaint_id: complaintId, text, latitude, longitude }),
      });

      if (!resp.ok) {
        throw new Error(`AI workflow execution failed with status ${resp.status}`);
      }

      return await resp.json();
    } catch (err) {
      console.error('[AGENTS-SERVICE] Workflow execution failed:', err);
      throw new InternalServerErrorException('AI multi-agent workflow is temporarily unavailable');
    }
  }

  async assistantChat(userId: string, message: string, role: string, context?: any) {
    try {
      const resp = await fetch(`${this.aiBaseUrl}/assistant/chat`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ user_id: userId, message, role, context }),
      });

      if (!resp.ok) {
        throw new Error(`AI assistant responded with status ${resp.status}`);
      }

      return await resp.json();
    } catch (err) {
      console.error('[AGENTS-SERVICE] Assistant chat failed:', err);
      throw new InternalServerErrorException('AI assistant service is temporarily unavailable');
    }
  }
}
