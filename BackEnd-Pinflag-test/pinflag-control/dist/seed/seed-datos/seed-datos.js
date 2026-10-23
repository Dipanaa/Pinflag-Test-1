"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEED_DATOS = void 0;
exports.SEED_DATOS = [
    {
        name: 'Caso de pedido de 60000 con 2 KG',
        priority: 1,
        minAmount: 50000.00,
        maxAmount: null,
        minWeight: 0.00,
        maxWeight: 2.00,
        maxDistanceMeters: 100,
        allowedDeliveryTypes: ['HOME_DELIVERY', 'STORE_PICKUP', 'PUDO'],
        targetCourier: 'Blue Express',
        isFreeShipping: true,
        shippingCostOverride: 0.00,
        estimatedDays: 1,
        isActive: true,
    }, {
        name: 'Menor a 20 kg con FedEx (Colisión)',
        priority: 2,
        minAmount: 0.00,
        maxAmount: null,
        minWeight: 0.00,
        maxWeight: 20.00,
        maxDistanceMeters: 80000,
        allowedDeliveryTypes: ['HOME_DELIVERY'],
        targetCourier: 'FedEx',
        isFreeShipping: false,
        shippingCostOverride: 4500.00,
        estimatedDays: 3,
        isActive: true,
    },
    {
        name: 'REGLA FALLBACK',
        priority: 999,
        minAmount: 0.00,
        maxAmount: null,
        minWeight: 0.00,
        maxWeight: null,
        maxDistanceMeters: null,
        allowedDeliveryTypes: ['HOME_DELIVERY', 'STORE_PICKUP', 'PUDO'],
        targetCourier: 'FedEx',
        isFreeShipping: false,
        shippingCostOverride: 4990.00,
        estimatedDays: 5,
        isActive: true,
    }
];
//# sourceMappingURL=seed-datos.js.map