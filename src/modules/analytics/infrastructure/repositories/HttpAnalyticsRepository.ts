import type { PortfolioAnalytics, AnalyticsPeriod, GlobalAnalytics } from '../../domain/entities/PortfolioAnalytics';
import type { AnalyticsRepository } from '../../domain/repositories/AnalyticsRepository';
import { httpClient } from '../../../../infrastructure/http/httpClient';

export class HttpAnalyticsRepository implements AnalyticsRepository {
  private readonly PATH = '/api/analytics';

  async getPortfolioAnalytics(
    portfolioId: string,
    period: AnalyticsPeriod
  ): Promise<PortfolioAnalytics> {
    return httpClient.getAuth<PortfolioAnalytics>(
      `${this.PATH}/portfolio/${portfolioId}?period=${period}`,
      'No se pudieron cargar las analíticas'
    );
  }

  async getGlobalAnalytics(period: AnalyticsPeriod): Promise<GlobalAnalytics> {
    return httpClient.getAuth<GlobalAnalytics>(
      `${this.PATH}/global?period=${period}`,
      'No se pudieron cargar las analíticas globales'
    );
  }
}
