import { MotorRegla } from './entities/motor-regla.entity';
import { Repository } from 'typeorm';
import { CreateMotorReglaDto } from './dto/create-motor-regla.dto';
import { UpdateMotorReglaDto } from './dto/update-motor-regla.dto';
import { PaginationDto } from "../common/dtos/pagination.dto";
import { CreatePedidoDto } from "../pedidos/dto/create-pedido.dto";
export declare class MotorReglasService {
    private readonly reglasRepository;
    constructor(reglasRepository: Repository<MotorRegla>);
    create(createMotorReglaDto: CreateMotorReglaDto): Promise<MotorRegla>;
    findAll(pagination: PaginationDto): Promise<MotorRegla[]>;
    update(id: string, updateMotorReglaDto: UpdateMotorReglaDto): Promise<MotorRegla>;
    remove(id: string): Promise<number | null | undefined>;
    extraerReglas(pedido: CreatePedidoDto): Promise<MotorRegla[]>;
}
