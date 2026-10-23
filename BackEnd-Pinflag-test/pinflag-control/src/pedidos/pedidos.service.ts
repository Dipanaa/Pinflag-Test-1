import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { MotorRegla } from 'src/motor-reglas/entities/motor-regla.entity';
import { Pedidos } from './entities/pedido.entity';
import { ReglasColisionadas } from 'src/motor-reglas/entities/colisiones-reglas.entity';

import { CreatePedidoDto } from './dto/create-pedido.dto';
import { MotorReglasService } from 'src/motor-reglas/motor-reglas.service';
import { PagoDto } from './dto/pago-pedido.dto';
import { ColisionRegla } from 'src/motor-reglas/interfaces/colision-reglas.interface';


@Injectable()
export class PedidosService {

  constructor(
    private readonly reglasService: MotorReglasService,
    private readonly dataSource: DataSource, // Usaremos queryrunner para realizar transacciones
    @InjectRepository(MotorRegla)
    private readonly reglasRepository: Repository<MotorRegla>,
    @InjectRepository(Pedidos)
    private readonly pedidosRepository: Repository<Pedidos>
  ) { }

  // Metodo Post
  async preCheckout(pedido: CreatePedidoDto) {
    // TODO: Controlar excepciones
    const reglas = await this.reglasService.extraerReglas(pedido);
    return reglas[0];
  }

  // Metodo Post
  async checkOut(pedido: PagoDto, idRegla: string) {

    // Extraer reglas para revaluar
    const reglas = await this.reglasService.extraerReglas(pedido);
    let reglaPedido = reglas.find((reglas) => reglas.id === idRegla);
    const reglasDescartadas = reglas.filter((reglas) => reglas.id !== idRegla);

    // Configuramos fallback
    if (!reglaPedido) {
      // Si no encontró el ID exacto, toma la regla fallback (ej. la de priority 999 o la última del listado)
      reglaPedido = reglas.find((regla) => regla.priority === 999) ?? reglas[0];
    }

    // Conexion con queryRunner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // # 1 Transaccion de pedido
      const pedidoCrear = queryRunner.manager.create(Pedidos, {
        amount: pedido.amount,
        weight: pedido.weight,
        distanceMeters: pedido.distanceMeters,
        deliveryType: pedido.deliveryType,
        appliedRule: this.reglasRepository.create(reglaPedido),
        appliedCourier: reglaPedido!.targetCourier,
        shippingCost: reglaPedido!.shippingCostOverride ?? 0, // Arreglo de nulos
        estimatedDeliveryDays: reglaPedido!.estimatedDays,
        hadCollision: reglasDescartadas.length > 0,
        status: 'CONFIRMED'
      });

      // Guardamos pedido
      const guardarPedido = await queryRunner.manager.save(Pedidos, pedidoCrear);

      // # 2 Transaccion de colision de reglas / pendiente
      // Rellenar colisiones de reglas

      const reglasColisionadasSnapshot: ColisionRegla[] = reglasDescartadas.map((rule) => ({
        id: rule.id,
        name: rule.name,
        priority: rule.priority,
        targetCourier: rule.targetCourier,
        shippingCostOverride: rule.shippingCostOverride,
        discardReason: `Descartada por menor prioridad (Prioridad ${rule.priority}) frente a ganadora (Prioridad ${reglaPedido.priority} - ${reglaPedido.name})`,
      }));

      const registroColision = queryRunner.manager.create(ReglasColisionadas, {
        orderId: guardarPedido.id,
        winningRuleId: reglaPedido.id,
        winningCourier: reglaPedido.targetCourier,
        collidedRules: reglasColisionadasSnapshot,
        orderSnapshot: {
          ...pedido
        },
      });

      // Guardamos colisiones
      const guardarReglasColisionadas = await queryRunner.manager.save(ReglasColisionadas, registroColision);

      // Commit de transaccion
      await queryRunner.commitTransaction();

      return guardarPedido;
    } catch (error) {
      // 8. Reversión en caso de falla
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error al procesar el checkout: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }

  }

  // Metodo Get 
  async retornarPedidos() {
    const pedidos = await this.pedidosRepository.find();
    return pedidos;
  }

}
