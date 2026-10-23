import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MotorReglasModule } from './motor-reglas/motor-reglas.module';
import { PedidosModule } from './pedidos/pedidos.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonController } from './common/common.controller';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true // Cuidado con el uso ya que en produccion no es recomendado / SOLO POR EFECTOS PRACTICOS
    }),
    MotorReglasModule,
    PedidosModule,
    CommonModule,
    SeedModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
