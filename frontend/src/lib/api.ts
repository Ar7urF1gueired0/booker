const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

let authToken: string | null = null;

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthDate: string;
  locationCity: string;
};

export type UpdateUserPayload = Partial<{
  fullName: string;
  locationCity: string | null;
  photoUrl: string | null;
  role: 'ADMIN' | 'USER';
}>;

export const setApiAuthToken = (token: string | null) => {
  authToken = token;
};

export const apiClient = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Adicionar token se existir
    const tokenFromStorage =
      authToken ?? (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    if (tokenFromStorage) {
      headers['Authorization'] = `Bearer ${tokenFromStorage}`;
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

  async register(data: RegisterPayload) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateUser(userId: number, data: UpdateUserPayload) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getTournaments() {
    return this.request('/tournaments');
  },

  async getMyTournaments() {
    return this.request('/tournaments/my');
  },

  async getTournament(id: number) {
    return this.request(`/tournaments/${id}`);
  },

  async createTournament(tournamentData: {
    name: string;
    arenaId: number;
    startDate: string;
    endDate?: string;
    registrationDeadline?: string;
    categoryFilter?: string;
    status?: string;
  }) {
    return this.request('/tournaments', {
      method: 'POST',
      body: JSON.stringify(tournamentData),
    });
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

  async getPosts() {
    return this.request('/posts');
  },

  async createPost(postData: { contentText: string; imageUrl: string }) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  async getArenas() {
    return this.request('/arenas');
  },
};
