import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MotorRegla } from './entities/motor-regla.entity';
import { Repository } from 'typeorm';

import { CreateMotorReglaDto } from './dto/create-motor-regla.dto';
import { UpdateMotorReglaDto } from './dto/update-motor-regla.dto';


import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CreatePedidoDto } from 'src/pedidos/dto/create-pedido.dto';

@Injectable()
export class MotorReglasService {

  constructor(
    @InjectRepository(MotorRegla)
    private readonly reglasRepository: Repository<MotorRegla>
  ) { }


  // Metodo POST
  async create(createMotorReglaDto: CreateMotorReglaDto) {

    try {

      if (createMotorReglaDto.allowedDeliveryTypes?.length === 0) throw new BadRequestException('El objeto no cumple con las condiciones necesarias');

      const regla = this.reglasRepository.create(createMotorReglaDto);
      await this.reglasRepository.save(regla)
      return regla;
    } catch (error) {

      console.log(error);
      throw new BadRequestException('El objeto no cumple con las condiciones necesarias');
    }

  }

  // Metodo GET
  async findAll(pagination: PaginationDto) {

    const reglas = await this.reglasRepository.find({
      take: pagination.limit,
      skip: pagination.offset
    });

    return reglas;
  }

  // Metodo PUT
  async update(id: string, updateMotorReglaDto: UpdateMotorReglaDto) {
    try {

      const regla = await this.reglasRepository.preload({
        id: id,
        ...updateMotorReglaDto
      });

      if (!regla) throw new NotFoundException(`La entidad con el id ${id} no existe`)

      await this.reglasRepository.save(regla);

      return regla;

    } catch (error) {

      console.log(error);
      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  // Metodo Delete
  async remove(id: string) {

    const regla = await this.reglasRepository.delete({ id: id });
    return regla.affected;
  }

  async extraerReglas(pedido: CreatePedidoDto) {
    // Obtener reglas que hicieron match

    const { amount, weight, distanceMeters } = pedido;

    const query = this.reglasRepository
      .createQueryBuilder('regla')
      .where('regla.isActive = :isActive', { isActive: true })

      // Validación de Monto: min_amount <= amount Y (max_amount IS NULL O max_amount >= amount)
      .andWhere('regla.minAmount <= :amount', { amount })
      .andWhere('(regla.maxAmount IS NULL OR regla.maxAmount >= :amount)', { amount })

      // Validación de Peso: min_weight <= weight Y (max_weight IS NULL O max_weight >= weight)
      .andWhere('regla.minWeight <= :weight', { weight })
      .andWhere('(regla.maxWeight IS NULL OR regla.maxWeight >= :weight)', { weight })

      // Validación de Cobertura/Distancia: max_distance_meters IS NULL O max_distance_meters >= distanceMeters
      .andWhere(
        '(regla.maxDistanceMeters IS NULL OR regla.maxDistanceMeters >= :distanceMeters)',
        { distanceMeters },
      );

    // Ordenamiento por prioridad: el entero más bajo gana (1 > 2 > 3)
    query.orderBy('regla.priority', 'ASC');

    return await query.getMany();
  }
}
