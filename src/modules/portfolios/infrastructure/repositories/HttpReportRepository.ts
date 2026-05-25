import { ReportSubmission } from "../../domain/entities/ReportSubmission";

const BASE_URL = 'http://localhost:8080/admin';

export class HttpReportRepository {
  async submitReport(report: ReportSubmission): Promise<void> {
    const res = await fetch(`${BASE_URL}/denuncias/reportar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error?.message || 'Error al enviar el reporte');
    }
  }
}