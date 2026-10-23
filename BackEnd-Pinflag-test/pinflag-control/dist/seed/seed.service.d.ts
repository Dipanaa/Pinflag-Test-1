import { MotorRegla } from "../motor-reglas/entities/motor-regla.entity";
import { DataSource, Repository } from 'typeorm';
export declare class SeedService {
    private readonly motorReglaRepository;
    private readonly dataSource;
    constructor(motorReglaRepository: Repository<MotorRegla>, dataSource: DataSource);
    ejecutarSeedReglas(): Promise<string>;
    eliminarTablasBD(): Promise<string>;
}
