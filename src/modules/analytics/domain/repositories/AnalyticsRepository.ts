import type { PortfolioAnalytics, AnalyticsPeriod, GlobalAnalytics } from '../entities/PortfolioAnalytics';

export interface AnalyticsRepository {
  getPortfolioAnalytics(portfolioId: string, period: AnalyticsPeriod): Promise<PortfolioAnalytics>;
  getGlobalAnalytics(period: AnalyticsPeriod): Promise<GlobalAnalytics>;
}
