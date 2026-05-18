import { Portfolio, CreatePortfolioDto, UpdateVisibilidadDto } from '../../domain/entities/Portfolio';
import { PortfolioRepository } from '../../domain/repositories/PortfolioRepository';
import { httpClient } from '../../../../infrastructure/http/httpClient';

export class HttpPortfolioRepository implements PortfolioRepository {
  private readonly PATH = '/api/portafolios';

  async getAll(): Promise<Portfolio[]> {
    return httpClient.getAuth<Portfolio[]>(
      this.PATH,
      'No se pudieron cargar los portafolios'
    );
  }

  async create(dto: CreatePortfolioDto): Promise<Portfolio> {
    return httpClient.postAuth<Portfolio>(
      this.PATH,
      dto,
      'Error al crear el portafolio'
    );
  }

  async delete(id: string): Promise<void> {
    return httpClient.deleteAuth<void>(
      `${this.PATH}/${id}`,
      'Error al eliminar el portafolio'
    );
  }

  async updateVisibilidad(id: string, dto: UpdateVisibilidadDto): Promise<Portfolio> {
    return httpClient.putAuth<Portfolio>(
      `${this.PATH}/${id}/visibilidad`,
      dto,
      'Error al guardar la visibilidad'
    );
  }

  async publish(id: string): Promise<Portfolio> {
    return httpClient.putAuth<Portfolio>(
      `${this.PATH}/${id}/publicar`,
      {},
      'Error al publicar el portafolio'
    );
  }

  async unpublish(id: string): Promise<Portfolio> {
    return httpClient.putAuth<Portfolio>(
      `${this.PATH}/${id}/privatizar`,
      {},
      'Error al privatizar el portafolio'
    );
  }
}
