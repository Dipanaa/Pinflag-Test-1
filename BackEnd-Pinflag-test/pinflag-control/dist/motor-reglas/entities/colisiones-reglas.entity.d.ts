import { ColisionRegla } from "../interfaces/colision-reglas.interface";
import * as snapshotPedidoInterface from "../../pedidos/interfaces/snapshot-pedido.interface";
export declare class ReglasColisionadas {
    id: string;
    orderId: string;
    winningRuleId: string;
    winningCourier: string;
    collidedRules: ColisionRegla[];
    orderSnapshot: snapshotPedidoInterface.SnapshotPedido;
    createdAt: Date;
}
