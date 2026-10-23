export type DeliveryType = 'HOME_DELIVERY' | 'STORE_PICKUP' | 'PUDO';

export interface MotorRegla {
  id: string;
  name: string;
  priority: number;
  minAmount: number;
  maxAmount: number | null;
  minWeight: number;
  maxWeight: number | null;
  maxDistanceMeters: number | null;
  allowedDeliveryTypes: DeliveryType[] | string[];
  targetCourier: string;
  isFreeShipping: boolean;
  shippingCostOverride: number | null;
  estimatedDays: number;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateMotorReglaPayload {
  tenantId: string;
  name: string;
  priority: number;
  minAmount?: number;
  maxAmount?: number | null;
  minWeight?: number;
  maxWeight?: number | null;
  maxDistanceMeters?: number | null;
  allowedDeliveryTypes?: DeliveryType[];
  targetCourier: string;
  isFreeShipping?: boolean;
  shippingCostOverride?: number | null;
  estimatedDays: number;
  isActive?: boolean;
}

export interface UpdateMotorReglaPayload {
  name?: string;
  priority?: number;
  shippingCostOverride?: number | null;
  isActive?: boolean;
  allowedDeliveryTypes?: string[];
}

export interface CollidedRuleInfo {
  id: string;
  name: string;
  priority: number;
  targetCourier: string;
  shippingCostOverride: number | null;
  estimatedDays: number;
  discardReason: string;
}

export interface ResolutionResult {
  winningRule: MotorRegla;
  collidedRules: CollidedRuleInfo[];
  finalCost: number;
  isFree: boolean;
  estimatedDays: number;
  courier: string;
  isFallback: boolean;
}
