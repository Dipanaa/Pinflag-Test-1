import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotorRegla } from './entities/motor-regla.entity';

import { MotorReglasService } from './motor-reglas.service';
import { MotorReglasController } from './motor-reglas.controller';

@Module({
  controllers: [MotorReglasController],
  providers: [MotorReglasService],
  imports: [TypeOrmModule.forFeature([MotorRegla])],
  exports: [MotorReglasService]
})
export class MotorReglasModule { }
