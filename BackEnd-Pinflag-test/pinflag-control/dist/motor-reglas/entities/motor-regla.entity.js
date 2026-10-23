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
exports.MotorRegla = void 0;
const typeorm_1 = require("typeorm");
let MotorRegla = class MotorRegla {
    id;
    name;
    priority;
    minAmount;
    maxAmount;
    minWeight;
    maxWeight;
    maxDistanceMeters;
    allowedDeliveryTypes;
    targetCourier;
    isFreeShipping;
    shippingCostOverride;
    estimatedDays;
    isActive;
    createdAt;
    freeDeliveryCheck() {
        if (this.isFreeShipping) {
            this.shippingCostOverride = 0;
        }
    }
    updateDeliveryCheck() {
        if (this.shippingCostOverride !== 0) {
            this.isFreeShipping = false;
        }
        this.isFreeShipping = true;
    }
};
exports.MotorRegla = MotorRegla;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MotorRegla.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 120 }),
    __metadata("design:type", String)
], MotorRegla.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', comment: 'Desempate clave (1 = mayor prioridad)' }),
    __metadata("design:type", Number)
], MotorRegla.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_amount',
        type: 'numeric',
        precision: 12,
        scale: 2,
        default: 0,
        transformer: {
            to: (value) => value,
            from: (value) => value !== null && value !== undefined ? parseFloat(value) : null,
        },
    }),
    __metadata("design:type", Number)
], MotorRegla.prototype, "minAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_amount',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
        transformer: {
            to: (value) => value,
            from: (value) => value !== null && value !== undefined ? parseFloat(value) : null,
        },
    }),
    __metadata("design:type", Object)
], MotorRegla.prototype, "maxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_weight',
        type: 'numeric',
        precision: 8,
        scale: 2,
        default: 0,
        transformer: {
            to: (value) => value,
            from: (value) => value !== null && value !== undefined ? parseFloat(value) : null,
        },
    }),
    __metadata("design:type", Number)
], MotorRegla.prototype, "minWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_weight',
        type: 'numeric',
        precision: 8,
        scale: 2,
        nullable: true,
        transformer: {
            to: (value) => value,
            from: (value) => value !== null && value !== undefined ? parseFloat(value) : null,
        },
    }),
    __metadata("design:type", Object)
], MotorRegla.prototype, "maxWeight", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_distance_meters',
        type: 'int',
        nullable: true,
    }),
    __metadata("design:type", Object)
], MotorRegla.prototype, "maxDistanceMeters", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allowed_delivery_types',
        type: 'varchar',
        length: 50,
        array: true,
        nullable: true,
    }),
    __metadata("design:type", Array)
], MotorRegla.prototype, "allowedDeliveryTypes", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'target_courier',
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], MotorRegla.prototype, "targetCourier", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_free_shipping',
        type: 'boolean',
        default: false,
    }),
    __metadata("design:type", Boolean)
], MotorRegla.prototype, "isFreeShipping", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_cost_override',
        type: 'numeric',
        precision: 12,
        scale: 2,
        nullable: true,
        transformer: {
            to: (value) => value,
            from: (value) => value !== null && value !== undefined ? parseFloat(value) : null,
        },
    }),
    __metadata("design:type", Object)
], MotorRegla.prototype, "shippingCostOverride", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'estimated_days',
        type: 'int',
    }),
    __metadata("design:type", Number)
], MotorRegla.prototype, "estimatedDays", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_active',
        type: 'boolean',
        default: true,
    }),
    __metadata("design:type", Boolean)
], MotorRegla.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'NOW()',
    }),
    __metadata("design:type", Date)
], MotorRegla.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MotorRegla.prototype, "freeDeliveryCheck", null);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MotorRegla.prototype, "updateDeliveryCheck", null);
exports.MotorRegla = MotorRegla = __decorate([
    (0, typeorm_1.Entity)('reglas')
], MotorRegla);
//# sourceMappingURL=motor-regla.entity.js.map