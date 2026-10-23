import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    BeforeInsert,
} from 'typeorm';

@Entity('reglas')
export class MotorRegla {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 120 })
    name: string;

    @Column({ type: 'int', comment: 'Desempate clave (1 = mayor prioridad)' })
    priority: number;

    // Condiciones de Entrada (Filtros Duros)
    @Column({
        name: 'min_amount',
        type: 'numeric',
        precision: 12,
        scale: 2,
        default: 0,
        transformer: {
            to: (value: number | null) => value,
            from: (value: string | null) =>
                value !== null && value !== undefined ? parseFloat(value) : null,
        },
    })
    minAmount: number;

    @Column({
        name: 'max_amount',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
        transformer: {
            to: (value: number | null) => value,
            from: (value: string | null) =>
                value !== null && value !== undefined ? parseFloat(value) : null,
        },
    })
    maxAmount: number | null;

    @Column({
        name: 'min_weight',
        type: 'numeric',
        precision: 8,
        scale: 2,
        default: 0,
        transformer: {
            to: (value: number | null) => value,
            from: (value: string | null) =>
                value !== null && value !== undefined ? parseFloat(value) : null,
        },
    })
    minWeight: number;

    @Column({
        name: 'max_weight',
        type: 'numeric',
        precision: 8,
        scale: 2,
        nullable: true,
        transformer: {
            to: (value: number | null) => value,
            from: (value: string | null) =>
                value !== null && value !== undefined ? parseFloat(value) : null,
        },
    })
    maxWeight: number | null;

    @Column({
        name: 'max_distance_meters',
        type: 'int',
        nullable: true,
    })
    maxDistanceMeters: number | null;

    @Column({
        name: 'allowed_delivery_types',
        type: 'varchar',
        length: 50,
        array: true,
        nullable: true,
    })
    allowedDeliveryTypes: string[];

    // Paquete de Acciones Cerrado (Resolución directa)
    @Column({
        name: 'target_courier',
        type: 'varchar',
        length: 50,
    })
    targetCourier: string;

    @Column({
        name: 'is_free_shipping',
        type: 'boolean',
        default: false,
    })
    isFreeShipping: boolean;

    @Column({
        name: 'shipping_cost_override',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
        transformer: {
            to: (value: number | null) => value,
            from: (value: string | null) =>
                value !== null && value !== undefined ? parseFloat(value) : null,
        },
    })
    shippingCostOverride: number | null;

    @Column({
        name: 'estimated_days',
        type: 'int',
    })
    estimatedDays: number;

    @Column({
        name: 'is_active',
        type: 'boolean',
        default: true,
    })
    isActive: boolean;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    createdAt: Date;

    // Evitar que exista un pedido gratis con valor de despacho
    @BeforeInsert()
    freeDeliveryCheck() {
        if (this.isFreeShipping) {
            this.shippingCostOverride = 0;
        }
    }

    @BeforeInsert()
    updateDeliveryCheck() {
        if (this.shippingCostOverride !== 0) {
            this.isFreeShipping = false;
        }
        this.isFreeShipping = true;
    }

}
