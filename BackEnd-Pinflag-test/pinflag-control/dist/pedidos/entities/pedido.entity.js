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
exports.Pedido = exports.Pedidos = void 0;
const typeorm_1 = require("typeorm");
const motor_regla_entity_1 = require("../../motor-reglas/entities/motor-regla.entity");
let Pedidos = class Pedidos {
    id;
    amount;
    weight;
    distanceMeters;
    deliveryType;
    appliedRule;
    appliedCourier;
    shippingCost;
    estimatedDeliveryDays;
    hadCollision;
    isFallbackApplied;
    status;
    createdAt;
};
exports.Pedidos = Pedidos;
exports.Pedido = Pedidos;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Pedidos.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'amount',
        type: 'numeric',
        precision: 12,
        scale: 2,
        transformer: {
            to: (value) => value,
            from: (value) => (value !== null && value !== undefined ? parseFloat(value) : value),
        },
    }),
    __metadata("design:type", Number)
], Pedidos.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'weight',
        type: 'numeric',
        precision: 8,
        scale: 2,
        transformer: {
            to: (value) => value,
            from: (value) => (value !== null && value !== undefined ? parseFloat(value) : value),
        },
    }),
    __metadata("design:type", Number)
], Pedidos.prototype, "weight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'distance_meters',
        type: 'int',
    }),
    __metadata("design:type", Number)
], Pedidos.prototype, "distanceMeters", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'delivery_type',
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], Pedidos.prototype, "deliveryType", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => motor_regla_entity_1.MotorRegla, { nullable: true, onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'applied_rule_id' }),
    __metadata("design:type", Object)
], Pedidos.prototype, "appliedRule", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'applied_courier',
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], Pedidos.prototype, "appliedCourier", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_cost',
        type: 'numeric',
        precision: 12,
        scale: 2,
        default: 0,
        transformer: {
            to: (value) => value,
            from: (value) => (value !== null && value !== undefined ? parseFloat(value) : value),
        },
    }),
    __metadata("design:type", Number)
], Pedidos.prototype, "shippingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estimated_delivery_days',
        type: 'int',
    }),
    __metadata("design:type", Number)
], Pedidos.prototype, "estimatedDeliveryDays", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'had_collision',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Pedidos.prototype, "hadCollision", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_fallback_applied',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], Pedidos.prototype, "isFallbackApplied", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'status',
        type: 'varchar',
        length: 50,
        default: 'CONFIRMED',
    }),
    __metadata("design:type", String)
], Pedidos.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    }),
    __metadata("design:type", Date)
], Pedidos.prototype, "createdAt", void 0);
exports.Pedido = exports.Pedidos = Pedidos = __decorate([
    (0, typeorm_1.Entity)('pedidos')
], Pedidos);
//# sourceMappingURL=pedido.entity.js.map