import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ColisionRegla } from "../interfaces/colision-reglas.interface";
import * as snapshotPedidoInterface from "src/pedidos/interfaces/snapshot-pedido.interface";


@Entity('reglas_colisionadas')
export class ReglasColisionadas {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'order_id', type: 'uuid', unique: true })
    orderId: string;

    @Column({ name: 'winning_rule_id', type: 'uuid' })
    winningRuleId: string;

    @Column({ name: 'winning_courier', type: 'varchar', length: 50 })
    winningCourier: string;

    @Column({ name: 'collided_rules', type: 'jsonb' })
    collidedRules: ColisionRegla[];

    @Column({ name: 'order_snapshot', type: 'jsonb' })
    orderSnapshot: snapshotPedidoInterface.SnapshotPedido; // Palabra reservada

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    })
    createdAt: Date;
}