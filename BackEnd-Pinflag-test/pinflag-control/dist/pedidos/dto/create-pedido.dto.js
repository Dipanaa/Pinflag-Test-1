"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePedidoDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreatePedidoDto {
    amount;
    weight;
    distanceMeters;
}
exports.CreatePedidoDto = CreatePedidoDto;
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'El amount debe ser un número con máximo 2 decimales' }),
    (0, class_validator_1.Min)(0, { message: 'El amount debe ser mayor o igual a 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El amount es obligatorio' }),
    __metadata("design:type", Number)
], CreatePedidoDto.prototype, "amount", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }, { message: 'El weight debe ser un número con máximo 2 decimales' }),
    (0, class_validator_1.Min)(0, { message: 'El weight debe ser mayor o igual a 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El weight es obligatorio' }),
    __metadata("design:type", Number)
], CreatePedidoDto.prototype, "weight", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'El distanceMeters debe ser un número entero' }),
    (0, class_validator_1.Min)(0, { message: 'El distanceMeters debe ser mayor o igual a 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El distanceMeters es obligatorio' }),
    __metadata("design:type", Number)
], CreatePedidoDto.prototype, "distanceMeters", void 0);
//# sourceMappingURL=create-pedido.dto.js.map