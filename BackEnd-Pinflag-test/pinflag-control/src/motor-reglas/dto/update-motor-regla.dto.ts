import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateMotorReglaDto } from './create-motor-regla.dto';

export class UpdateMotorReglaDto extends PartialType(
  PickType(CreateMotorReglaDto, [
    'name',
    'priority',
    'shippingCostOverride',
    'isActive',
    'allowedDeliveryTypes',
  ] as const),
) {}
