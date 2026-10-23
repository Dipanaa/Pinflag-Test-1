import { MotorReglasService } from './motor-reglas.service';
import { CreateMotorReglaDto } from './dto/create-motor-regla.dto';
import { UpdateMotorReglaDto } from './dto/update-motor-regla.dto';
import { PaginationDto } from "../common/dtos/pagination.dto";
export declare class MotorReglasController {
    private readonly motorReglasService;
    constructor(motorReglasService: MotorReglasService);
    create(createMotorReglaDto: CreateMotorReglaDto): Promise<import("./entities/motor-regla.entity").MotorRegla>;
    findAll(paginationDto: PaginationDto): Promise<import("./entities/motor-regla.entity").MotorRegla[]>;
    update(id: string, updateMotorReglaDto: UpdateMotorReglaDto): Promise<import("./entities/motor-regla.entity").MotorRegla>;
    remove(id: string): Promise<number | null | undefined>;
}
