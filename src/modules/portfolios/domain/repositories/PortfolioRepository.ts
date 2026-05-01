import { Portfolio, CreatePortfolioDto } from '../entities/Portfolio';

export interface PortfolioRepository {
  getAll(): Promise<Portfolio[]>;
  create(dto: CreatePortfolioDto): Promise<Portfolio>;
  delete(id: string): Promise<void>;
}
