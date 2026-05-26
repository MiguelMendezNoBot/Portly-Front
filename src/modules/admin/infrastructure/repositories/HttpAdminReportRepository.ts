import { BASE_URL } from '../../../../infrastructure/http/httpClient';
import { getToken } from '../../../../infrastructure/storage/storage';
import { UserReportFilters } from '../../domain/entities/UserReportFilters';

export class HttpAdminReportRepository {
  private readonly PATH = '/api/admin/reports';

  async downloadUserReport(filters: UserReportFilters): Promise<void> {
    const query = new URLSearchParams({
      desde: filters.desde,
      hasta: filters.hasta,
      estado: filters.estado,
    }).toString();

    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${this.PATH}/users?${query}`, {
      method: 'GET',
      headers,
    });

    if (res.status === 204) {
      throw new Error('No hay usuarios que coincidan con los filtros seleccionados.');
    }

    if (!res.ok) {
      throw new Error('Error al generar el reporte.');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_usuarios.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  async downloadSkillReport(filters: { desde: string; hasta: string; skillType: string }): Promise<void> {
    const query = new URLSearchParams({
      desde: filters.desde,
      hasta: filters.hasta,
      skillType: filters.skillType,
    }).toString();

    const headers: Record<string, string> = {};
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${this.PATH}/skills?${query}`, {
      method: 'GET',
      headers,
    });

    if (res.status === 204) {
      throw new Error('No hay habilidades que coincidan con los filtros seleccionados.');
    }

    if (!res.ok) {
      throw new Error('Error al generar el reporte.');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte_habilidades.pdf';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
