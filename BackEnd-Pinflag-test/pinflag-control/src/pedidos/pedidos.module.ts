import { Module } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedidos } from './entities/pedido.entity';
import { MotorReglasModule } from 'src/motor-reglas/motor-reglas.module';
import { MotorRegla } from 'src/motor-reglas/entities/motor-regla.entity';
import { ReglasColisionadas } from 'src/motor-reglas/entities/colisiones-reglas.entity';

@Module({
  controllers: [PedidosController],
  providers: [PedidosService],
  imports: [
    TypeOrmModule.forFeature([Pedidos, MotorRegla, ReglasColisionadas]),
    MotorReglasModule
  ]
})
export class PedidosModule { }
