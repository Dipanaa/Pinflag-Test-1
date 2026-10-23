import { CreateMotorReglaDto } from './create-motor-regla.dto';
declare const UpdateMotorReglaDto_base: import("@nestjs/mapped-types", { with: { "resolution-mode": "import" } }).MappedType<Partial<Pick<CreateMotorReglaDto, "name" | "priority" | "allowedDeliveryTypes" | "shippingCostOverride" | "isActive">>>;
export declare class UpdateMotorReglaDto extends UpdateMotorReglaDto_base {
}
export {};
