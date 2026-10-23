import React from 'react';
import { AlertTriangle, Truck, Clock } from 'lucide-react';
import type { CollidedRuleInfo } from '../../types/regla.types';
import { Badge } from '../common/Badge';

interface CollisionCardProps {
  collision: CollidedRuleInfo;
  winnerPriority: number;
}

export const CollisionCard: React.FC<CollisionCardProps> = ({
  collision,
  winnerPriority,
}) => {
  const formattedCost =
    collision.shippingCostOverride !== null && collision.shippingCostOverride !== undefined
      ? `$${collision.shippingCostOverride.toLocaleString('es-CL')} CLP`
      : 'Costo Estándar';

  return (
    <div className="group relative rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 transition-all duration-200 hover:border-amber-500/50 hover:bg-amber-950/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-200 text-sm">{collision.name}</span>
              <Badge variant="amber" size="sm">
                Prioridad #{collision.priority}
              </Badge>
              <span className="text-xs text-amber-400/80 font-mono">
                (Perdió vs #{winnerPriority})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {collision.discardReason}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center pl-11 sm:pl-0">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">{collision.targetCourier}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{collision.estimatedDays} d</span>
          </div>

          <div className="text-right">
            <span className="font-medium text-amber-300 font-mono">{formattedCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
