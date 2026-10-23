import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { MotorRegla } from '../../motor-reglas/entities/motor-regla.entity';

@Entity('pedidos')
export class Pedidos {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // Variables del carrito evaluadas
    @Column({
        name: 'amount',
        type: 'numeric',
        precision: 12,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => (value !== null && value !== undefined ? parseFloat(value) : value),
        },
    })
    amount: number;

    @Column({
        name: 'weight',
        type: 'numeric',
        precision: 8,
        scale: 2,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => (value !== null && value !== undefined ? parseFloat(value) : value),
        },
    })
    weight: number;

    @Column({
        name: 'distance_meters',
        type: 'int',
    })
    distanceMeters: number;

    @Column({
        name: 'delivery_type',
        type: 'varchar',
        length: 50,
    })
    deliveryType: string;


    // Relacion de la regla (Regla aplicada al pedido)
    @ManyToOne(() => MotorRegla, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'applied_rule_id' })
    appliedRule?: MotorRegla | null;

    // Snapshot inmutable de la promesa de despacho
    @Column({
        name: 'applied_courier',
        type: 'varchar',
        length: 50,
    })
    appliedCourier: string;

    @Column({
        name: 'shipping_cost',
        type: 'numeric',
        precision: 12,
        scale: 2,
        default: 0,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => (value !== null && value !== undefined ? parseFloat(value) : value),
        },
    })
    shippingCost: number;

    @Column({
        name: 'estimated_delivery_days',
        type: 'int',
    })
    estimatedDeliveryDays: number;

    // Banderas de auditoría rápida
    @Column({
        name: 'had_collision',
        type: 'boolean',
        default: false,
    })
    hadCollision: boolean;

    @Column({
        name: 'is_fallback_applied',
        type: 'boolean',
        default: false,
    })
    isFallbackApplied: boolean;

    @Column({
        name: 'status',
        type: 'varchar',
        length: 50,
        default: 'CONFIRMED',
    })
    status: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    createdAt: Date;
}

// Exportamos alias en singular por compatibilidad
export { Pedidos as Pedido };
