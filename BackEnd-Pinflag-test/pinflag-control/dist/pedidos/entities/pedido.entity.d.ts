import { MotorRegla } from '../../motor-reglas/entities/motor-regla.entity';
export declare class Pedidos {
    id: string;
    amount: number;
    weight: number;
    distanceMeters: number;
    deliveryType: string;
    appliedRule?: MotorRegla | null;
    appliedCourier: string;
    shippingCost: number;
    estimatedDeliveryDays: number;
    hadCollision: boolean;
    isFallbackApplied: boolean;
    status: string;
    createdAt: Date;
}
export { Pedidos as Pedido };
