
export interface AutomateAction {
  operation: string;
  thought?: string;
  x?: string;
  y?: string;
  keys?: string[];
  content?: string;
  summary?: string;
}

export interface AutomateRequest {
  actions: AutomateAction[];
  objective: string;
}

export interface DirectAutomationRequest {
  objective: string;
}

export interface AutomateResponse {
  success: boolean;
  message: string;
  executedActions?: number;
  error?: string;
}

export interface DirectAutomationResponse {
  success: boolean;
  message: string;
  actions_executed?: number;
  error?: string;
}

export class AutomateService {
  private baseUrl: string;
  private isConnected: boolean = false;

  constructor() {
    // Default to localhost for development, will be configurable
    this.baseUrl = 'http://localhost:8000';
  }

  async checkConnection(): Promise<boolean> {
    try {
      console.log('Checking automation service connection to:', this.baseUrl);
      
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly set CORS mode
      });
      
      console.log('Health check response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Health check response data:', data);
        this.isConnected = true;
        return true;
      } else {
        console.error('Health check failed with status:', response.status);
        this.isConnected = false;
        return false;
      }
    } catch (error) {
      console.error('Automate service connection failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Direct automation method that mimics CLI behavior
   * Takes user speech input and automatically executes automation
   */
  async directAutomate(objective: string): Promise<DirectAutomationResponse> {
    try {
      console.log('Direct automation request:', objective);
      
      const response = await fetch(`${this.baseUrl}/direct-automate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ objective }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to execute direct automation');
      }

      const result = await response.json();
      console.log('Direct automation result:', result);
      return result;
    } catch (error) {
      console.error('Direct automation failed:', error);
      return {
        success: false,
        message: 'Failed to execute automation',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async executeActions(request: AutomateRequest): Promise<AutomateResponse> {
    try {
      console.log('Executing automation request:', request);
      
      const response = await fetch(`${this.baseUrl}/automate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to execute automation');
      }

      const result = await response.json();
      console.log('Automation execution result:', result);
      return result;
    } catch (error) {
      console.error('Automation execution failed:', error);
      return {
        success: false,
        message: 'Failed to execute automation',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async generateActions(objective: string): Promise<AutomateAction[]> {
    try {
      console.log('Generating actions for objective:', objective);
      
      const response = await fetch(`${this.baseUrl}/generate-actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ objective }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(error.error || 'Failed to generate actions');
      }

      const result = await response.json();
      console.log('Generated actions result:', result);
      return result.actions || [];
    } catch (error) {
      console.error('Action generation failed:', error);
      throw new Error('Failed to generate automation actions');
    }
  }

  isServiceConnected(): boolean {
    return this.isConnected;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
    console.log('Automation service base URL set to:', url);
  }
}

export const automateService = new AutomateService();
