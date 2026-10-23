import { request } from './api.client';
import type {
  PreCheckoutPayload,
  CheckoutPayload,
  Pedido,
  SimulationParams,
} from '../types/pedido.types';
import type { MotorRegla, ResolutionResult, CollidedRuleInfo } from '../types/regla.types';

export const pedidosService = {
  /**
   * Invoca el endpoint de preCheckout del backend
   * Retorna la regla ganadora según el motor de TypeORM
   */
  async preCheckout(payload: PreCheckoutPayload): Promise<MotorRegla> {
    return request<MotorRegla>('/pedidos/preCheckout', {
      method: 'POST',
      body: JSON.stringify({
        amount: Number(payload.amount),
        weight: Number(payload.weight),
        distanceMeters: Number(payload.distanceMeters),
      }),
    });
  },

  /**
   * Ejecuta la resolución de despacho completa:
   * 1. Consulta la regla ganadora oficial al backend
   * 2. Detecta todas las colisiones entre las reglas activas cargadas
   * 3. Aplica lógica de gratuidad por STORE_PICKUP o bandera isFreeShipping
   */
  async cotizarResolucion(
    params: SimulationParams,
    todasLasReglas: MotorRegla[]
  ): Promise<ResolutionResult> {
    // 1. Obtener ganadora desde el backend
    const winnerFromBackend = await this.preCheckout({
      amount: params.amount,
      weight: params.weight,
      distanceMeters: params.distanceMeters,
    });

    if (!winnerFromBackend) {
      throw new Error('No se encontró ninguna regla elegible en el motor (ni regla fallback).');
    }

    // 2. Extraer todas las reglas que hacen match con los criterios
    const matchingRules = todasLasReglas
      .filter((rule) => {
        if (!rule.isActive) return false;

        // Validación de monto: minAmount <= amount && (maxAmount IS NULL || maxAmount >= amount)
        const matchAmount =
          params.amount >= (rule.minAmount ?? 0) &&
          (rule.maxAmount === null || rule.maxAmount === undefined || params.amount <= rule.maxAmount);

        // Validación de peso: minWeight <= weight && (maxWeight IS NULL || maxWeight >= weight)
        const matchWeight =
          params.weight >= (rule.minWeight ?? 0) &&
          (rule.maxWeight === null || rule.maxWeight === undefined || params.weight <= rule.maxWeight);

        // Validación de cobertura: maxDistanceMeters IS NULL || maxDistanceMeters >= distanceMeters
        const matchDistance =
          rule.maxDistanceMeters === null ||
          rule.maxDistanceMeters === undefined ||
          params.distanceMeters <= rule.maxDistanceMeters;

        // Validación opcional de tipo de entrega
        const matchDeliveryType =
          !rule.allowedDeliveryTypes ||
          rule.allowedDeliveryTypes.length === 0 ||
          rule.allowedDeliveryTypes.includes(params.deliveryType);

        return matchAmount && matchWeight && matchDistance && matchDeliveryType;
      })
      .sort((a, b) => a.priority - b.priority);

    // Identificar reglas colisionadas (reglas que cumplieron condiciones pero perdieron ante la ganadora)
    const collidedRules: CollidedRuleInfo[] = matchingRules
      .filter((rule) => rule.id !== winnerFromBackend.id)
      .map((rule) => ({
        id: rule.id,
        name: rule.name,
        priority: rule.priority,
        targetCourier: rule.targetCourier,
        shippingCostOverride: rule.shippingCostOverride,
        estimatedDays: rule.estimatedDays,
        discardReason: `Descartada por menor prioridad (#${rule.priority}) frente a ganadora (#${winnerFromBackend.priority} - ${winnerFromBackend.name})`,
      }));

    // Determinar costo final y gratuidad
    const isStorePickup = params.deliveryType === 'STORE_PICKUP';
    const isFree = isStorePickup || winnerFromBackend.isFreeShipping || (winnerFromBackend.shippingCostOverride === 0);
    const finalCost = isFree ? 0 : (winnerFromBackend.shippingCostOverride ?? 0);

    return {
      winningRule: winnerFromBackend,
      collidedRules,
      finalCost,
      isFree,
      estimatedDays: isStorePickup ? 0 : winnerFromBackend.estimatedDays,
      courier: isStorePickup ? 'Retiro en Tienda' : winnerFromBackend.targetCourier,
      isFallback: winnerFromBackend.priority >= 999,
    };
  },

  /**
   * Simula el pago y confirma la orden invocando POST /api/pedidos/payment/:id
   * Persiste la orden y el snapshot de colisiones en el backend
   */
  async simularPagoYConfirmacion(
    winningRuleId: string,
    payload: CheckoutPayload
  ): Promise<Pedido> {
    return request<Pedido>(`/pedidos/payment/${winningRuleId}`, {
      method: 'POST',
      body: JSON.stringify({
        amount: Number(payload.amount),
        weight: Number(payload.weight),
        distanceMeters: Number(payload.distanceMeters),
        deliveryType: payload.deliveryType,
      }),
    });
  },

  /**
   * Obtiene el listado histórico de pedidos registrados
   */
  async getPedidos(): Promise<Pedido[]> {
    const pedidos = await request<Pedido[]>('/pedidos', {
      method: 'GET',
    });
    // Ordenar por fecha descendente (más recientes primero)
    return pedidos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Remueve un pedido del sistema
   */
  async removePedido(id: string): Promise<void> {
    await request<void>(`/pedidos/${id}`, {
      method: 'DELETE',
    });
  },
};
