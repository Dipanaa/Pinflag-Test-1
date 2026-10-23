import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';

import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PagoDto } from './dto/pago-pedido.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) { }


  // Pieza fundamental del sistema para crear pedidos y evaluar reglas
  @Post('preCheckout')
  preCheckoutDespacho(@Body() pedido: CreatePedidoDto) {
    return this.pedidosService.preCheckout(pedido);
  }

  @Post("payment/:id")
  pago(@Body() pedido: PagoDto, @Param('id', ParseUUIDPipe) idRegla: string) {
    return this.pedidosService.checkOut(pedido, idRegla);
  }

  @Get()
  todosPedidos() {
    return this.pedidosService.retornarPedidos();
  }
}
