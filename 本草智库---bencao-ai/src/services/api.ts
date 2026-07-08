import { User, Herb, ConstitutionType } from '../types';

const API_BASE_URL = '/api';

async function fetchWithFallback(endpoint: string, options?: RequestInit, fallbackData?: any) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }
    return await response.json();
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
       console.warn(`API fallback to mock for ${endpoint}`);
       if (fallbackData !== undefined) return fallbackData;
    }
    throw error;
  }
}

export const api = {
  login: async (username: string, password?: string): Promise<User> => {
    return fetchWithFallback('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }, {
      id: 'mock-' + Date.now(),
      username,
      avatar: 'default.png',
      role: username === 'admin' ? 'admin' : 'user'
    });
  },

  searchHerbs: async (query: string): Promise<Herb[]> => {
    return fetchWithFallback(`/herbs?q=${encodeURIComponent(query)}`, {
      method: 'GET'
    }, []); 
  },

  getDailyHerb: async (): Promise<Herb | null> => {
    return fetchWithFallback('/herbs/daily', {
      method: 'GET'
    }, null);
  },
  
  addHerb: async (herbData: Partial<Herb>): Promise<any> => {
    return fetchWithFallback('/herbs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(herbData)
    });
  },

  saveTestResult: async (username: string, result: ConstitutionType): Promise<any> => {
    return fetchWithFallback('/test-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, result })
    }, { success: true, mock: true });
  },

  getLastTestResult: async (username: string): Promise<{ result: ConstitutionType | null, date?: string }> => {
    return fetchWithFallback(`/test-result?username=${encodeURIComponent(username)}`, {
      method: 'GET'
    }, { result: null });
  },

  getUsers: async (): Promise<User[]> => {
    return fetchWithFallback('/users', {
      method: 'GET'
    }, [
      { id: '1', username: 'admin', avatar: 'default.png', role: 'admin' },
      { id: '2', username: 'user1', avatar: 'default.png', role: 'user' },
    ]);
  },

  deleteUser: async (id: string): Promise<any> => {
    return fetchWithFallback(`/users/${id}`, {
      method: 'DELETE'
    }, { success: true });
  }
};