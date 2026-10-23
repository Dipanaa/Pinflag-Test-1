import { request } from './api.client';
import type {
  MotorRegla,
  CreateMotorReglaPayload,
  UpdateMotorReglaPayload,
} from '../types/regla.types';

export const reglasService = {
  /**
   * Obtiene todas las reglas registradas en el motor
   */
  async getReglas(pagination?: { limit?: number; offset?: number }): Promise<MotorRegla[]> {
    const params = new URLSearchParams();
    if (pagination?.limit !== undefined) params.append('limit', String(pagination.limit));
    if (pagination?.offset !== undefined) params.append('offset', String(pagination.offset));
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const rules = await request<MotorRegla[]>(`/motor-reglas${queryString}`, {
      method: 'GET',
    });
    // Garantizar orden ascendente por prioridad (1 = mayor prioridad)
    return rules.sort((a, b) => a.priority - b.priority);
  },

  /**
   * Obtiene una regla específica por ID
   */
  async getReglaById(id: string): Promise<MotorRegla> {
    return request<MotorRegla>(`/motor-reglas/${id}`, {
      method: 'GET',
    });
  },

  /**
   * Crea una nueva regla de despacho
   */
  async createRegla(payload: CreateMotorReglaPayload): Promise<MotorRegla> {
    // Si no se especifica tenantId, aseguramos un UUID v4 válido
    const body: CreateMotorReglaPayload = {
      ...payload,
      tenantId: payload.tenantId || crypto.randomUUID(),
      isActive: payload.isActive ?? true,
    };

    return request<MotorRegla>('/motor-reglas', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Actualiza campos permitidos de una regla (según UpdateMotorReglaDto)
   */
  async updateRegla(id: string, payload: UpdateMotorReglaPayload): Promise<MotorRegla> {
    // Filtrar estrictamente a los campos permitidos por UpdateMotorReglaDto
    const cleanPayload: UpdateMotorReglaPayload = {};
    if (payload.name !== undefined) cleanPayload.name = payload.name;
    if (payload.priority !== undefined) cleanPayload.priority = Number(payload.priority);
    if (payload.shippingCostOverride !== undefined) {
      cleanPayload.shippingCostOverride = payload.shippingCostOverride !== null 
        ? Number(payload.shippingCostOverride) 
        : null;
    }
    if (payload.isActive !== undefined) cleanPayload.isActive = Boolean(payload.isActive);
    if (payload.allowedDeliveryTypes !== undefined) {
      cleanPayload.allowedDeliveryTypes = payload.allowedDeliveryTypes;
    }

    return request<MotorRegla>(`/motor-reglas/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(cleanPayload),
    });
  },

  /**
   * Elimina una regla por su UUID
   */
  async deleteRegla(id: string): Promise<number> {
    return request<number>(`/motor-reglas/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Persiste la nueva jerarquía de prioridades tras Drag & Drop o reordenamiento
   */
  async reorderPriorities(updates: { id: string; priority: number }[]): Promise<void> {
    // Actualizamos cada regla modificada con su nueva prioridad
    await Promise.all(
      updates.map(({ id, priority }) =>
        request<MotorRegla>(`/motor-reglas/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ priority }),
        })
      )
    );
  },
};
