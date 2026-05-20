import { httpClient } from '../../../../infrastructure/http/httpClient';
import type {
  ExploreSearchParams,
  ExploreSearchResult,
} from '../../domain/entities/ExplorePortfolio';

export class HttpExploreRepository {
  private readonly PATH = '/api/portafolios/search';

  async search(params: ExploreSearchParams): Promise<ExploreSearchResult> {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.sort) query.set('sort', params.sort);
    if (params.nacionalidad) query.set('nacionalidad', params.nacionalidad);
    if (params.habilidadesBlandas)
      query.set('habilidadesBlandas', params.habilidadesBlandas);
    if (params.habilidadesTecnicas)
      query.set('habilidadesTecnicas', params.habilidadesTecnicas);
    if (params.gradoAcademico)
      query.set('gradoAcademico', params.gradoAcademico);
    query.set('page', String(params.page ?? 1));
    query.set('limit', String(params.limit ?? 12));

    const url = `${this.PATH}?${query.toString()}`;
    return httpClient.get<ExploreSearchResult>(
      url,
      'No se pudieron cargar los portafolios'
    );
  }
}

export const exploreRepository = new HttpExploreRepository();
