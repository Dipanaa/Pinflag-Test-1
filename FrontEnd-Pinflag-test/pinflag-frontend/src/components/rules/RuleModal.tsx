import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Scale, DollarSign, MapPin, Save } from 'lucide-react';
import type { MotorRegla, CreateMotorReglaPayload, DeliveryType } from '../../types/regla.types';

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCreate: (payload: CreateMotorReglaPayload) => Promise<void>;
  onSaveUpdate: (
    id: string,
    payload: {
      name?: string;
      priority?: number;
      shippingCostOverride?: number | null;
      isActive?: boolean;
      allowedDeliveryTypes?: string[];
    }
  ) => Promise<void>;
  editingRule: MotorRegla | null;
  currentHighestPriority: number;
}

export const RuleModal: React.FC<RuleModalProps> = ({
  isOpen,
  onClose,
  onSaveCreate,
  onSaveUpdate,
  editingRule,
  currentHighestPriority,
}) => {
  const isEditing = Boolean(editingRule);

  // Estados del formulario
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<number>(1);
  const [targetCourier, setTargetCourier] = useState('Blue Express');
  const [minAmount, setMinAmount] = useState<number | ''>(0);
  const [maxAmount, setMaxAmount] = useState<number | ''>('');
  const [minWeight, setMinWeight] = useState<number | ''>(0);
  const [maxWeight, setMaxWeight] = useState<number | ''>('');
  const [maxDistanceMeters, setMaxDistanceMeters] = useState<number | ''>('');
  const [allowedDeliveryTypes, setAllowedDeliveryTypes] = useState<DeliveryType[]>([
    'HOME_DELIVERY',
    'STORE_PICKUP',
    'PUDO',
  ]);
  const [isFreeShipping, setIsFreeShipping] = useState(false);
  const [shippingCostOverride, setShippingCostOverride] = useState<number | ''>(0);
  const [estimatedDays, setEstimatedDays] = useState<number>(2);
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingRule) {
      setName(editingRule.name);
      setPriority(editingRule.priority);
      setTargetCourier(editingRule.targetCourier);
      setMinAmount(editingRule.minAmount ?? 0);
      setMaxAmount(editingRule.maxAmount ?? '');
      setMinWeight(editingRule.minWeight ?? 0);
      setMaxWeight(editingRule.maxWeight ?? '');
      setMaxDistanceMeters(editingRule.maxDistanceMeters ?? '');
      setAllowedDeliveryTypes(
        (editingRule.allowedDeliveryTypes as DeliveryType[]) || [
          'HOME_DELIVERY',
          'STORE_PICKUP',
          'PUDO',
        ]
      );
      setIsFreeShipping(editingRule.isFreeShipping);
      setShippingCostOverride(editingRule.shippingCostOverride ?? 0);
      setEstimatedDays(editingRule.estimatedDays);
      setIsActive(editingRule.isActive);
    } else {
      // Valores por defecto al crear
      setName('');
      setPriority(currentHighestPriority + 1);
      setTargetCourier('Blue Express');
      setMinAmount(0);
      setMaxAmount('');
      setMinWeight(0);
      setMaxWeight('');
      setMaxDistanceMeters('');
      setAllowedDeliveryTypes(['HOME_DELIVERY', 'STORE_PICKUP', 'PUDO']);
      setIsFreeShipping(false);
      setShippingCostOverride(3990);
      setEstimatedDays(2);
      setIsActive(true);
    }
    setErrorMsg(null);
  }, [editingRule, isOpen, currentHighestPriority]);

  if (!isOpen) return null;

  const toggleDeliveryType = (type: DeliveryType) => {
    if (allowedDeliveryTypes.includes(type)) {
      if (allowedDeliveryTypes.length === 1) return; // al menos 1
      setAllowedDeliveryTypes(allowedDeliveryTypes.filter((t) => t !== type));
    } else {
      setAllowedDeliveryTypes([...allowedDeliveryTypes, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('El nombre de la regla es obligatorio.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editingRule) {
        // En PATCH solo enviamos los campos autorizados por UpdateMotorReglaDto
        await onSaveUpdate(editingRule.id, {
          name: name.trim(),
          priority: Number(priority),
          shippingCostOverride: isFreeShipping
            ? 0
            : shippingCostOverride === ''
            ? null
            : Number(shippingCostOverride),
          isActive,
          allowedDeliveryTypes,
        });
      } else {
        // En POST enviamos el DTO de creación completo con tenantId
        await onSaveCreate({
          tenantId: crypto.randomUUID(),
          name: name.trim(),
          priority: Number(priority),
          targetCourier,
          minAmount: minAmount === '' ? 0 : Number(minAmount),
          maxAmount: maxAmount === '' ? null : Number(maxAmount),
          minWeight: minWeight === '' ? 0 : Number(minWeight),
          maxWeight: maxWeight === '' ? null : Number(maxWeight),
          maxDistanceMeters: maxDistanceMeters === '' ? null : Number(maxDistanceMeters),
          allowedDeliveryTypes,
          isFreeShipping,
          shippingCostOverride: isFreeShipping
            ? 0
            : shippingCostOverride === ''
            ? null
            : Number(shippingCostOverride),
          estimatedDays: Number(estimatedDays),
          isActive,
        });
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la regla';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">
                {isEditing ? 'Editar Política de Despacho' : 'Nueva Política de Despacho'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? `Modificando: ${editingRule?.name}`
                  : 'Configura las condiciones de filtro y acción de resolución'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          {/* Nombre y Prioridad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre de la Regla *
              </label>
              <input
                type="text"
                required
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Ej. Promoción Verano Blue Express"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Prioridad (1 = Mayor) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Courier y Plazo Estimado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Courier / Transportista {isEditing && <span className="text-slate-500">(Fijo)</span>}
              </label>
              <select
                disabled={isEditing}
                value={targetCourier}
                onChange={(e) => setTargetCourier(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              >
                <option value="Blue Express">Blue Express</option>
                <option value="FedEx">FedEx</option>
                <option value="Chilexpress">Chilexpress</option>
                <option value="Starken">Starken</option>
                <option value="CorreosChile">CorreosChile</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Días Estimados de Entrega
              </label>
              <input
                type="number"
                min="0"
                disabled={isEditing}
                value={estimatedDays}
                onChange={(e) => setEstimatedDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-850 border border-slate-700 rounded-xl text-slate-100 text-sm font-mono focus:outline-none focus:border-indigo-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Rangos Duros: Monto */}
          <div className="p-3.5 rounded-xl bg-slate-850/50 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Filtro por Monto del Carrito ($ CLP)
              {isEditing && <span className="text-[10px] text-slate-500 font-normal">(Fijo en creación)</span>}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Monto Mínimo</label>
                <input
                  type="number"
                  min="0"
                  disabled={isEditing}
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Monto Máximo (Vacío = Sin límite)</label>
                <input
                  type="number"
                  min="0"
                  disabled={isEditing}
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Sin tope"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Rangos Duros: Peso y Distancia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-850/50 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-400" />
                Filtro por Peso (kg)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Min (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    disabled={isEditing}
                    value={minWeight}
                    onChange={(e) => setMinWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Máx (kg)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    disabled={isEditing}
                    value={maxWeight}
                    onChange={(e) => setMaxWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Sin tope"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-850/50 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Radio Cobertura (Metros)
              </span>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Distancia Máxima (Vacío = Sin límite)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  disabled={isEditing}
                  value={maxDistanceMeters}
                  onChange={(e) => setMaxDistanceMeters(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Ej. 1000"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Costo y Envío Gratis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center p-3.5 rounded-xl bg-slate-850/50 border border-slate-800">
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFreeShipping}
                  onChange={(e) => {
                    setIsFreeShipping(e.target.checked);
                    if (e.target.checked) setShippingCostOverride(0);
                  }}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-semibold text-emerald-400">Envío Gratis (Gratuidad)</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Costo Despacho Override ($ CLP)
              </label>
              <input
                type="number"
                min="0"
                disabled={isFreeShipping}
                value={isFreeShipping ? 0 : shippingCostOverride}
                onChange={(e) =>
                  setShippingCostOverride(e.target.value === '' ? '' : Number(e.target.value))
                }
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs font-mono disabled:opacity-40"
              />
            </div>
          </div>

          {/* Modalidades de Entrega */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Modalidades de Entrega Admitidas
            </label>
            <div className="flex gap-2 flex-wrap">
              {(['HOME_DELIVERY', 'STORE_PICKUP', 'PUDO'] as DeliveryType[]).map((type) => {
                const selected = allowedDeliveryTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleDeliveryType(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                        : 'bg-slate-850 text-slate-400 border-slate-700/60 hover:border-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Activo / Inactivo */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-slate-900 w-4 h-4 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-300">
                Regla activa en la evaluación del motor
              </span>
            </label>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Regla' : 'Crear Regla'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
