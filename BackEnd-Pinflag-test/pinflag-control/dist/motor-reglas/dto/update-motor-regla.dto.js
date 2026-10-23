"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMotorReglaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_motor_regla_dto_1 = require("./create-motor-regla.dto");
class UpdateMotorReglaDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.PickType)(create_motor_regla_dto_1.CreateMotorReglaDto, [
    'name',
    'priority',
    'shippingCostOverride',
    'isActive',
    'allowedDeliveryTypes',
])) {
}
exports.UpdateMotorReglaDto = UpdateMotorReglaDto;
//# sourceMappingURL=update-motor-regla.dto.js.map