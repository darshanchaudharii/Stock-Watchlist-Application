import { API_BASE_URL } from "../config/api";

class AxiosInstance {
  private baseURL: string;
  private withCredentials: boolean;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.withCredentials = true;
  }

  async get<T>(url: string): Promise<T> {
    const response = await fetch(this.baseURL + url, {
      method: 'GET',
      credentials: this.withCredentials ? 'include' : 'omit',
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    const response = await fetch(this.baseURL + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: this.withCredentials ? 'include' : 'omit',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return response.json();
  }

  async delete(url: string): Promise<void> {
    const response = await fetch(this.baseURL + url, {
      method: 'DELETE',
      credentials: this.withCredentials ? 'include' : 'omit',
    });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
  }
}

const api = new AxiosInstance(API_BASE_URL);

export default api;
