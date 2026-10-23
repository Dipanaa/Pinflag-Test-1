import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MotorRegla } from 'src/motor-reglas/entities/motor-regla.entity';
import { DataSource, Repository } from 'typeorm';
import { SEED_DATOS } from './seed-datos/seed-datos';
import { error } from 'console';


@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(MotorRegla)
    private readonly motorReglaRepository: Repository<MotorRegla>,
    private readonly dataSource: DataSource, // Usaremos queryrunner para realizar transacciones
  ) { }


  // Ejecucion de seed con reglas iniciales
  async ejecutarSeedReglas() {
    try {
      const seedReglas = await this.motorReglaRepository.create(SEED_DATOS);
      await this.motorReglaRepository.save(seedReglas);
      return 'SEED ejecutado correctamente';
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Error al ejecutar SEED')
    }

  }

  async eliminarTablasBD() {
    await this.dataSource.query(`
      TRUNCATE TABLE reglas_colisionadas, pedidos, reglas RESTART IDENTITY CASCADE;
    `);
    return `Registros eliminados de la base de datos`;
  }





}
