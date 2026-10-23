import React from 'react';
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Truck,
  AlertTriangle,
  Scale,
  DollarSign,
  MapPin,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { MotorRegla } from '../../types/regla.types';
import { Badge } from '../common/Badge';

interface RuleCardProps {
  rule: MotorRegla;
  index: number;
  totalRules: number;
  isDragging: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onToggleActive: (rule: MotorRegla) => void;
  onEdit: (rule: MotorRegla) => void;
  onDelete: (rule: MotorRegla) => void;
}

export const RuleCard: React.FC<RuleCardProps> = ({
  rule,
  index,
  totalRules,
  isDragging,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onMoveUp,
  onMoveDown,
  onToggleActive,
  onEdit,
  onDelete,
}) => {
  const isFallback = rule.priority >= 999;

  const courierColor = (courier: string) => {
    const c = courier.toLowerCase();
    if (c.includes('blue')) return 'blue';
    if (c.includes('fedex')) return 'purple';
    if (c.includes('chile')) return 'rose';
    if (c.includes('star')) return 'amber';
    return 'indigo';
  };

  return (
    <div
      draggable={!isFallback}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative rounded-2xl border transition-all duration-200 ${
        isDragging
          ? 'opacity-40 scale-[0.98] border-indigo-500 bg-indigo-950/30'
          : isFallback
          ? 'border-amber-500/40 bg-gradient-to-r from-slate-900 via-amber-950/15 to-slate-900 shadow-md shadow-amber-950/10'
          : rule.isActive
          ? 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:shadow-lg hover:shadow-slate-950/50'
          : 'border-slate-800/50 bg-slate-900/40 opacity-70'
      } p-5`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Lado izquierdo: Drag Handle, Badge de Prioridad, Nombre y Fallback */}
        <div className="flex items-start sm:items-center gap-3">
          {/* Drag Handle y botones de accesibilidad Up/Down */}
          <div className="flex flex-col sm:flex-row items-center gap-1 shrink-0 pt-0.5 sm:pt-0">
            <div
              className={`p-1.5 rounded-lg text-slate-500 ${
                isFallback
                  ? 'cursor-not-allowed opacity-30'
                  : 'cursor-grab active:cursor-grabbing hover:text-slate-300 hover:bg-slate-800'
              }`}
              title={isFallback ? 'Regla de contingencia fija' : 'Arrastra para reordenar prioridad'}
            >
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                disabled={index === 0 || isFallback}
                onClick={() => onMoveUp(index)}
                className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800 disabled:opacity-20 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors"
                title="Subir prioridad (prioridad más alta)"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={index >= totalRules - 1 || isFallback}
                onClick={() => onMoveDown(index)}
                className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800 disabled:opacity-20 disabled:hover:text-slate-400 disabled:hover:bg-transparent transition-colors"
                title="Bajar prioridad (prioridad más baja)"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Información principal de la regla */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant={isFallback ? 'amber' : rule.priority <= 2 ? 'emerald' : 'indigo'}
                size="md"
              >
                Prioridad #{rule.priority}
              </Badge>

              <Badge variant={courierColor(rule.targetCourier)} size="sm" icon={<Truck className="w-3 h-3" />}>
                {rule.targetCourier}
              </Badge>

              {isFallback && (
                <Badge
                  variant="amber"
                  size="sm"
                  icon={<AlertTriangle className="w-3 h-3 text-amber-400" />}
                >
                  Regla Fallback de Emergencia
                </Badge>
              )}

              {!rule.isActive && (
                <Badge variant="slate" size="sm" icon={<XCircle className="w-3 h-3 text-rose-400" />}>
                  Inactiva
                </Badge>
              )}
            </div>

            <h4 className="font-bold text-slate-100 text-base mt-1.5 flex items-center gap-2">
              <span>{rule.name}</span>
            </h4>
          </div>
        </div>

        {/* Lado Central: Rangos Aceptados (Monto, Peso, Distancia) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-850/60 rounded-xl p-3 border border-slate-800/80 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              Rango Monto
            </span>
            <p className="font-mono text-slate-200 mt-0.5">
              ${rule.minAmount?.toLocaleString('es-CL') ?? '0'} -{' '}
              {rule.maxAmount ? `$${rule.maxAmount.toLocaleString('es-CL')}` : 'Sin tope'}
            </p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Scale className="w-3 h-3 text-indigo-400" />
              Rango Peso
            </span>
            <p className="font-mono text-slate-200 mt-0.5">
              {rule.minWeight ?? 0} kg - {rule.maxWeight ? `${rule.maxWeight} kg` : 'Sin tope'}
            </p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              Radio Cobertura
            </span>
            <p className="font-mono text-slate-200 mt-0.5">
              {rule.maxDistanceMeters ? `≤ ${rule.maxDistanceMeters} m` : 'Todo el país'}
            </p>
          </div>
        </div>

        {/* Lado Derecho: Costo, Plazo y Acciones */}
        <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
          <div className="text-left lg:text-right">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
              Costo Despacho
            </span>
            {rule.isFreeShipping || rule.shippingCostOverride === 0 ? (
              <Badge variant="emerald" size="sm">
                Envío Gratis
              </Badge>
            ) : (
              <span className="font-mono font-bold text-slate-200 text-sm">
                ${rule.shippingCostOverride?.toLocaleString('es-CL') ?? '0'} CLP
              </span>
            )}
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {rule.estimatedDays} d de entrega
            </span>
          </div>

          {/* Botones de acción: Switch activo, Editar, Eliminar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleActive(rule)}
              className={`p-2 rounded-xl border transition-colors ${
                rule.isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
              }`}
              title={rule.isActive ? 'Desactivar regla' : 'Activar regla'}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onEdit(rule)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-400 border border-slate-700 hover:border-indigo-500/30 transition-colors"
              title="Editar regla"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            {!isFallback && (
              <button
                type="button"
                onClick={() => onDelete(rule)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/30 transition-colors"
                title="Eliminar regla"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
