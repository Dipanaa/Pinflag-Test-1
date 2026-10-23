import type { DeliveryType, MotorRegla } from './regla.types';

export interface PreCheckoutPayload {
  amount: number;
  weight: number;
  distanceMeters: number;
}

export interface CheckoutPayload extends PreCheckoutPayload {
  deliveryType: DeliveryType;
}

export interface Pedido {
  id: string;
  amount: number;
  weight: number;
  distanceMeters: number;
  deliveryType: DeliveryType | string;
  appliedRule?: MotorRegla | null;
  appliedCourier: string;
  shippingCost: number;
  estimatedDeliveryDays: number;
  hadCollision: boolean;
  isFallbackApplied: boolean;
  status: string;
  createdAt: string;
}

export interface SimulationParams {
  amount: number;
  weight: number;
  distanceMeters: number;
  deliveryType: DeliveryType;
}
