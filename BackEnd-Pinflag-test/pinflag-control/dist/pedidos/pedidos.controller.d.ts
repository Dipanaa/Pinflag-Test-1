import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PagoDto } from './dto/pago-pedido.dto';
export declare class PedidosController {
    private readonly pedidosService;
    constructor(pedidosService: PedidosService);
    preCheckoutDespacho(pedido: CreatePedidoDto): Promise<import("../motor-reglas/entities/motor-regla.entity").MotorRegla>;
    pago(pedido: PagoDto, idRegla: string): Promise<import("./entities/pedido.entity").Pedidos>;
    todosPedidos(): Promise<import("./entities/pedido.entity").Pedidos[]>;
}
