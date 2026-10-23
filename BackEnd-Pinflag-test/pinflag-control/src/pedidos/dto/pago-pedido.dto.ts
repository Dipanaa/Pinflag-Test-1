import { IsNotEmpty, IsString, Min } from "class-validator";
import { CreatePedidoDto } from "./create-pedido.dto";
import { Type } from "class-transformer";


export class PagoDto extends CreatePedidoDto {

    @Type(() => String)
    @IsString()
    @IsNotEmpty({ message: 'El weight es obligatorio' })
    deliveryType: string;

}