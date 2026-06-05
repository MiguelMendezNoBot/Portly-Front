import { httpClient } from '../../../infrastructure/http/httpClient';
import type {
  ProfessionalProfile,
  CreateProfessionalProfileDTO,
  UpdateProfessionalProfileDTO,
} from '../domain/professionalProfile.entity';

const BASE = '/api/perfiles-profesionales';

export class HttpProfessionalProfileRepository {
  getAll(): Promise<ProfessionalProfile[]> {
    return httpClient.getAuth<ProfessionalProfile[]>(
      BASE,
      'Error al cargar perfiles profesionales'
    );
  }

  create(dto: CreateProfessionalProfileDTO): Promise<ProfessionalProfile> {
    return httpClient.postAuth<ProfessionalProfile>(
      BASE,
      dto,
      'Error al crear el perfil profesional'
    );
  }

  update(
    id: string,
    dto: UpdateProfessionalProfileDTO
  ): Promise<ProfessionalProfile> {
    return httpClient.putAuth<ProfessionalProfile>(
      `${BASE}/${id}`,
      dto,
      'Error al actualizar el perfil profesional'
    );
  }

  delete(id: string): Promise<void> {
    return httpClient.deleteAuth<void>(
      `${BASE}/${id}`,
      'Error al eliminar el perfil profesional'
    );
  }

  async uploadPhoto(file: File): Promise<string> {
    const res = await httpClient.uploadFile<{ fotoUrl: string }>(
      `${BASE}/foto`,
      file,
      'file',
      'Error al subir la foto'
    );
    return res.fotoUrl;
  }
}
