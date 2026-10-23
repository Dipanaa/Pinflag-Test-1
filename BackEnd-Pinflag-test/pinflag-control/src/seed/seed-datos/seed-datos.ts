

export const SEED_DATOS = [
    // 1. Regla Ganadora del caso Pinflag (Prioridad 1)
    // Cumple condición de monto sobre $50.000 con Blue Express y despacho gratis
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

        // 2. Regla Colisionada del caso Pinflag (Prioridad 2)
        // Cumple condición de peso menor o igual a 20 kg con FedEx, pero pierde por prioridad
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

    // 3. Regla Base de Contingencia / Fallback (Prioridad 999)
    // Rangos universales para garantizar cobertura operativa si ninguna regla específica hace match
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

]