import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    Min,
} from 'class-validator';

export class CreatePedidoDto {

    @Type(() => Number)
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El amount debe ser un número con máximo 2 decimales' },
    )
    @Min(0, { message: 'El amount debe ser mayor o igual a 0' })
    @IsNotEmpty({ message: 'El amount es obligatorio' })
    amount: number;

    @Type(() => Number)
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'El weight debe ser un número con máximo 2 decimales' },
    )
    @Min(0, { message: 'El weight debe ser mayor o igual a 0' })
    @IsNotEmpty({ message: 'El weight es obligatorio' })
    weight: number;

    @Type(() => Number)
    @IsInt({ message: 'El distanceMeters debe ser un número entero' })
    @Min(0, { message: 'El distanceMeters debe ser mayor o igual a 0' })
    @IsNotEmpty({ message: 'El distanceMeters es obligatorio' })
    distanceMeters: number;

}
