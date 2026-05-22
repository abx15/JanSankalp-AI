export interface AIRequest {
  endpoint: string;
  data?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

class AIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  async request<T = any>({ endpoint, data, method = 'POST' }: AIRequest): Promise<AIResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // AI-specific methods
  async generateText(prompt: string, options?: any) {
    return this.request({
      endpoint: '/api/generate/text',
      data: { prompt, ...options },
    });
  }

  async analyzeData(data: any, analysisType: string) {
    return this.request({
      endpoint: '/api/analyze',
      data: { data, analysisType },
    });
  }

  async predict(model: string, input: any) {
    return this.request({
      endpoint: '/api/predict',
      data: { model, input },
    });
  }
}

export const aiClient = new AIClient();
