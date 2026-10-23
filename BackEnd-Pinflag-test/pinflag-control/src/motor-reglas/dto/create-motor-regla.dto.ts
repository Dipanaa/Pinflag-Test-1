import {
    IsArray,
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


import { Type } from 'class-transformer';
export class CreateMotorReglaDto {
    @IsUUID('4', { message: 'El tenantId debe ser un UUID válido (versión 4)' })
    @IsNotEmpty({ message: 'El tenantId es obligatorio' })
    tenantId: string;
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(120, { message: 'El nombre no debe superar los 120 caracteres' })
    name: string;

    @Type(() => Number)
    @IsInt({ message: 'La prioridad debe ser un número entero' })
    @Min(0, { message: 'La prioridad debe ser positiva' })
    priority: number;

    // Condiciones de Entrada (Filtros Duros)
    @IsOptional()
    @Type(() => Number)
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'minAmount debe ser un número con máximo 2 decimales' },
    )
    @Min(0, { message: 'minAmount debe ser mayor o igual a 0' })
    minAmount?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'maxAmount debe ser un número con máximo 2 decimales' },
    )
    @Min(0, { message: 'maxAmount debe ser mayor o igual a 0' })
    maxAmount?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'minWeight debe ser un número con máximo 2 decimales' },
    )
    @Min(0, { message: 'minWeight debe ser mayor o igual a 0' })
    minWeight?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'maxWeight debe ser un número con máximo 2 decimales' },
    )
    @Min(0, { message: 'maxWeight debe ser mayor o igual a 0' })
    maxWeight?: number | null;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'maxDistanceMeters debe ser un número entero' })
    @Min(0, { message: 'maxDistanceMeters debe ser mayor o igual a 0' })
    maxDistanceMeters?: number | null;

    @IsOptional()
    @IsArray({ message: 'allowedDeliveryTypes debe ser un arreglo de cadenas' })
    @IsString({
        each: true,
        message: 'Cada elemento en allowedDeliveryTypes debe ser una cadena de texto',
    })
    @MaxLength(50, {
        each: true,
        message: 'Cada elemento en allowedDeliveryTypes no debe superar 50 caracteres',
    })
    allowedDeliveryTypes?: string[];

    // Paquete de Acciones Cerrado (Resolución directa)
    @IsString({ message: 'targetCourier debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'targetCourier es obligatorio' })
    @MaxLength(50, { message: 'targetCourier no debe superar los 50 caracteres' })
    targetCourier: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean({ message: 'isFreeShipping debe ser un valor booleano' })
    isFreeShipping?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber(
        { maxDecimalPlaces: 2 },
        { message: 'shippingCostOverride debe ser un número con máximo 2 decimales' },
    )
    @Min(0, { message: 'shippingCostOverride debe ser mayor o igual a 0' })
    shippingCostOverride?: number | null;

    @Type(() => Number)
    @IsInt({ message: 'estimatedDays debe ser un número entero' })
    @Min(0, { message: 'estimatedDays debe ser mayor o igual a 0' })
    estimatedDays: number;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean({ message: 'isActive debe ser un valor booleano' })
    isActive?: boolean;
}
