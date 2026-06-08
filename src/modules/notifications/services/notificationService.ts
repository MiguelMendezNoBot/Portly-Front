import { httpClient } from '../../../infrastructure/http/httpClient';
import { Notification } from '../domain/Notification';

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    return httpClient.getAuth<Notification[]>('/api/notificaciones', 'Error al obtener notificaciones');
  },

  getUnreadCount: async (): Promise<number> => {
    const data = await httpClient.getAuth<{ count: number }>('/api/notificaciones/no-leidas', 'Error al obtener notificaciones no leidas');
    return data.count;
  },

  markAsRead: async (): Promise<void> => {
    return httpClient.putAuth<void>('/api/notificaciones/leer', undefined, 'Error al marcar notificaciones como leidas');
  },

  markOneAsRead: async (id: string): Promise<void> => {
    return httpClient.putAuth<void>(`/api/notificaciones/${id}/leer`, undefined, 'Error al marcar notificación como leída');
  }
};
