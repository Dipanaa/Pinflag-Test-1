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
exports.MotorReglasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const motor_regla_entity_1 = require("./entities/motor-regla.entity");
const typeorm_2 = require("typeorm");
let MotorReglasService = class MotorReglasService {
    reglasRepository;
    constructor(reglasRepository) {
        this.reglasRepository = reglasRepository;
    }
    async create(createMotorReglaDto) {
        try {
            if (createMotorReglaDto.allowedDeliveryTypes?.length === 0)
                throw new common_1.BadRequestException('El objeto no cumple con las condiciones necesarias');
            const regla = this.reglasRepository.create(createMotorReglaDto);
            await this.reglasRepository.save(regla);
            return regla;
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('El objeto no cumple con las condiciones necesarias');
        }
    }
    async findAll(pagination) {
        const reglas = await this.reglasRepository.find({
            take: pagination.limit,
            skip: pagination.offset
        });
        return reglas;
    }
    async update(id, updateMotorReglaDto) {
        try {
            const regla = await this.reglasRepository.preload({
                id: id,
                ...updateMotorReglaDto
            });
            if (!regla)
                throw new common_1.NotFoundException(`La entidad con el id ${id} no existe`);
            await this.reglasRepository.save(regla);
            return regla;
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException('Error en el servidor');
        }
    }
    async remove(id) {
        const regla = await this.reglasRepository.delete({ id: id });
        return regla.affected;
    }
    async extraerReglas(pedido) {
        const { amount, weight, distanceMeters } = pedido;
        const query = this.reglasRepository
            .createQueryBuilder('regla')
            .where('regla.isActive = :isActive', { isActive: true })
            .andWhere('regla.minAmount <= :amount', { amount })
            .andWhere('(regla.maxAmount IS NULL OR regla.maxAmount >= :amount)', { amount })
            .andWhere('regla.minWeight <= :weight', { weight })
            .andWhere('(regla.maxWeight IS NULL OR regla.maxWeight >= :weight)', { weight })
            .andWhere('(regla.maxDistanceMeters IS NULL OR regla.maxDistanceMeters >= :distanceMeters)', { distanceMeters });
        query.orderBy('regla.priority', 'ASC');
        return await query.getMany();
    }
};
exports.MotorReglasService = MotorReglasService;
exports.MotorReglasService = MotorReglasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(motor_regla_entity_1.MotorRegla)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MotorReglasService);
//# sourceMappingURL=motor-reglas.service.js.map