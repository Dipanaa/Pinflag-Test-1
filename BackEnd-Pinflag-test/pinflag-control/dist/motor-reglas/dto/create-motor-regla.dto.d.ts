export declare class CreateMotorReglaDto {
    tenantId: string;
    name: string;
    priority: number;
    minAmount?: number;
    maxAmount?: number | null;
    minWeight?: number;
    maxWeight?: number | null;
    maxDistanceMeters?: number | null;
    allowedDeliveryTypes?: string[];
    targetCourier: string;
    isFreeShipping?: boolean;
    shippingCostOverride?: number | null;
    estimatedDays: number;
    isActive?: boolean;
}
