import { GitHubRepo } from '../entities/Project';

export interface GitHubRepository {
  getRepos(): Promise<GitHubRepo[]>;
}
