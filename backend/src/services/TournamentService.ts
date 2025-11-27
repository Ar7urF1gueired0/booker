export class TournamentService {
  static async createTournament(data: {
    name: string;
    format: 'knockout' | 'round-robin';
    courts: number;
    playersPerMatch: number;
  }) {
    return {
      id: '1',
      ...data,
      createdAt: new Date(),
    };
  }

  static async getTournaments() {
    return [];
  }

  static async getTournamentById(id: string) {
    return null;
  }
}
