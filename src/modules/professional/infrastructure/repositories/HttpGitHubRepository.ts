import { GitHubRepo } from '../../domain/entities/Project';
import { GitHubRepository } from '../../domain/repositories/GitHubRepository';
import { httpClient } from '../../../../infrastructure/http/httpClient';

export class HttpGitHubRepository implements GitHubRepository {
  private readonly PATH = '/api/github/repos';

  async getRepos(): Promise<GitHubRepo[]> {
    return httpClient.getAuth<GitHubRepo[]>(
      this.PATH,
      'No se pudo obtener los repositorios de GitHub'
    );
  }
}
