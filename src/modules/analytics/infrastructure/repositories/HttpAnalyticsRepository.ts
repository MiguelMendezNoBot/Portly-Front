import type { PortfolioAnalytics, AnalyticsPeriod } from '../../domain/entities/PortfolioAnalytics';
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
}
