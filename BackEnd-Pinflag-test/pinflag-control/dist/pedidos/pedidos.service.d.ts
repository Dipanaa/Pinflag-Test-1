import { DataSource, Repository } from 'typeorm';
import { MotorRegla } from "../motor-reglas/entities/motor-regla.entity";
import { Pedidos } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { MotorReglasService } from "../motor-reglas/motor-reglas.service";
import { PagoDto } from './dto/pago-pedido.dto';
export declare class PedidosService {
    private readonly reglasService;
    private readonly dataSource;
    private readonly reglasRepository;
    private readonly pedidosRepository;
    constructor(reglasService: MotorReglasService, dataSource: DataSource, reglasRepository: Repository<MotorRegla>, pedidosRepository: Repository<Pedidos>);
    preCheckout(pedido: CreatePedidoDto): Promise<MotorRegla>;
    checkOut(pedido: PagoDto, idRegla: string): Promise<Pedidos>;
    retornarPedidos(): Promise<Pedidos[]>;
}
