import { httpClient } from '../../../../infrastructure/http/httpClient';
import { DashboardStats } from '../../domain/entities/DashboardStats';

export class HttpAdminDashboardRepository {
  async getDashboardStats(): Promise<DashboardStats> {
    return httpClient.getAuth<DashboardStats>('/api/admin/dashboard');
  }
}
