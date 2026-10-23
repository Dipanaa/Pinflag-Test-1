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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PedidosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const motor_regla_entity_1 = require("../motor-reglas/entities/motor-regla.entity");
const pedido_entity_1 = require("./entities/pedido.entity");
const colisiones_reglas_entity_1 = require("../motor-reglas/entities/colisiones-reglas.entity");
const motor_reglas_service_1 = require("../motor-reglas/motor-reglas.service");
let PedidosService = class PedidosService {
    reglasService;
    dataSource;
    reglasRepository;
    pedidosRepository;
    constructor(reglasService, dataSource, reglasRepository, pedidosRepository) {
        this.reglasService = reglasService;
        this.dataSource = dataSource;
        this.reglasRepository = reglasRepository;
        this.pedidosRepository = pedidosRepository;
    }
    async preCheckout(pedido) {
        const reglas = await this.reglasService.extraerReglas(pedido);
        return reglas[0];
    }
    async checkOut(pedido, idRegla) {
        const reglas = await this.reglasService.extraerReglas(pedido);
        let reglaPedido = reglas.find((reglas) => reglas.id === idRegla);
        const reglasDescartadas = reglas.filter((reglas) => reglas.id !== idRegla);
        if (!reglaPedido) {
            reglaPedido = reglas.find((regla) => regla.priority === 999) ?? reglas[0];
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const pedidoCrear = queryRunner.manager.create(pedido_entity_1.Pedidos, {
                amount: pedido.amount,
                weight: pedido.weight,
                distanceMeters: pedido.distanceMeters,
                deliveryType: pedido.deliveryType,
                appliedRule: this.reglasRepository.create(reglaPedido),
                appliedCourier: reglaPedido.targetCourier,
                shippingCost: reglaPedido.shippingCostOverride ?? 0,
                estimatedDeliveryDays: reglaPedido.estimatedDays,
                hadCollision: reglasDescartadas.length > 0,
                status: 'CONFIRMED'
            });
            const guardarPedido = await queryRunner.manager.save(pedido_entity_1.Pedidos, pedidoCrear);
            const reglasColisionadasSnapshot = reglasDescartadas.map((rule) => ({
                id: rule.id,
                name: rule.name,
                priority: rule.priority,
                targetCourier: rule.targetCourier,
                shippingCostOverride: rule.shippingCostOverride,
                discardReason: `Descartada por menor prioridad (Prioridad ${rule.priority}) frente a ganadora (Prioridad ${reglaPedido.priority} - ${reglaPedido.name})`,
            }));
            const registroColision = queryRunner.manager.create(colisiones_reglas_entity_1.ReglasColisionadas, {
                orderId: guardarPedido.id,
                winningRuleId: reglaPedido.id,
                winningCourier: reglaPedido.targetCourier,
                collidedRules: reglasColisionadasSnapshot,
                orderSnapshot: {
                    ...pedido
                },
            });
            const guardarReglasColisionadas = await queryRunner.manager.save(colisiones_reglas_entity_1.ReglasColisionadas, registroColision);
            await queryRunner.commitTransaction();
            return guardarPedido;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.InternalServerErrorException(`Error al procesar el checkout: ${error.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
    async retornarPedidos() {
        const pedidos = await this.pedidosRepository.find();
        return pedidos;
    }
};
exports.PedidosService = PedidosService;
exports.PedidosService = PedidosService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, typeorm_1.InjectRepository)(motor_regla_entity_1.MotorRegla)),
    __param(3, (0, typeorm_1.InjectRepository)(pedido_entity_1.Pedidos)),
    __metadata("design:paramtypes", [motor_reglas_service_1.MotorReglasService,
        typeorm_2.DataSource,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PedidosService);
//# sourceMappingURL=pedidos.service.js.map