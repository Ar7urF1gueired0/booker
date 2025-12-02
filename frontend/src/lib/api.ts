const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Adicionar token se existir
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'API Error');
    }

    return response.json();
  },

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(fullName: string, email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password }),
    });
  },

  async getTournaments() {
    return this.request('/tournaments');
  },

  async getTournament(id: number) {
    return this.request(`/tournaments/${id}`);
  },

  async registerTournament(tournamentId: number, partnerId?: number) {
    return this.request(`/registrations/${tournamentId}/register`, {
      method: 'POST',
      body: JSON.stringify({ partnerId }),
    });
  },

  async getTournamentRegistrations(tournamentId: number) {
    return this.request(`/registrations/${tournamentId}`);
  },
};
