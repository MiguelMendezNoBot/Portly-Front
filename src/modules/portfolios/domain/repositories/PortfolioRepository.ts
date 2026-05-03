import { Portfolio, CreatePortfolioDto, UpdateVisibilidadDto } from '../entities/Portfolio';

export interface PortfolioRepository {
  getAll(): Promise<Portfolio[]>;
  create(dto: CreatePortfolioDto): Promise<Portfolio>;
  delete(id: string): Promise<void>;
  updateVisibilidad(id: string, dto: UpdateVisibilidadDto): Promise<Portfolio>;
}
