import type { PortfolioAnalytics, AnalyticsPeriod } from '../entities/PortfolioAnalytics';

export interface AnalyticsRepository {
  getPortfolioAnalytics(portfolioId: string, period: AnalyticsPeriod): Promise<PortfolioAnalytics>;
}
