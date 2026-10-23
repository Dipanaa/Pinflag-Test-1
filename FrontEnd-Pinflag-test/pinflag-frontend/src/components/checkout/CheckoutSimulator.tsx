import React, { useState } from 'react';
import {
  Truck,
  Store,
  MapPin,
  Scale,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PackageCheck,
  CreditCard,
} from 'lucide-react';
import type { DeliveryType, MotorRegla, ResolutionResult } from '../../types/regla.types';
import type { Pedido, SimulationParams } from '../../types/pedido.types';
import { pedidosService } from '../../services/pedidos.service';
import { Badge } from '../common/Badge';
import { CollisionCard } from './CollisionCard';

interface CheckoutSimulatorProps {
  rules: MotorRegla[];
  onOrderCreated: (order: Pedido) => void;
  onNavigateToOrders: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const CheckoutSimulator: React.FC<CheckoutSimulatorProps> = ({
  rules,
  onOrderCreated,
  onNavigateToOrders,
  showToast,
}) => {
  // Estado del formulario de cotización - inputs libres que permiten cualquier valor (ej: 544431, unidades 1-9, décimas)
  const [amountStr, setAmountStr] = useState<string>('60000');
  const [weightStr, setWeightStr] = useState<string>('15');
  const [distanceStr, setDistanceStr] = useState<string>('400');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('HOME_DELIVERY');

  // Estado de resolución y colisiones
  const [resolution, setResolution] = useState<ResolutionResult | null>(null);
  const [showCollisions, setShowCollisions] = useState<boolean>(true);
  const [isQuoting, setIsQuoting] = useState<boolean>(false);

  // Estado de pago y confirmación
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Pedido | null>(null);

  // Valores numéricos parseados
  const numericAmount = Math.max(0, parseFloat(amountStr) || 0);
  const numericWeight = Math.max(0, parseFloat(weightStr) || 0);
  const numericDistance = Math.max(0, Math.round(parseFloat(distanceStr) || 0));

  // Escenarios preestablecidos para pruebas rápidas
  const scenarios = [
    {
      label: 'Promo >$50k (Colisión Blue vs FedEx)',
      icon: Sparkles,
      params: { amount: 65000, weight: 12, distanceMeters: 400, deliveryType: 'HOME_DELIVERY' as DeliveryType },
      color: 'hover:border-emerald-500/40 hover:bg-emerald-500/5',
    },
    {
      label: 'Media Carga (FedEx Prioridad #2)',
      icon: Truck,
      params: { amount: 35000, weight: 18, distanceMeters: 750, deliveryType: 'HOME_DELIVERY' as DeliveryType },
      color: 'hover:border-indigo-500/40 hover:bg-indigo-500/5',
    },
    {
      label: 'Retiro en Tienda (Gratis)',
      icon: Store,
      params: { amount: 45000, weight: 5, distanceMeters: 200, deliveryType: 'STORE_PICKUP' as DeliveryType },
      color: 'hover:border-blue-500/40 hover:bg-blue-500/5',
    },
    {
      label: 'Distancia Alta (Fallback #999)',
      icon: AlertTriangle,
      params: { amount: 20000, weight: 40, distanceMeters: 3500, deliveryType: 'HOME_DELIVERY' as DeliveryType },
      color: 'hover:border-amber-500/40 hover:bg-amber-500/5',
    },
  ];

  const applyScenario = (scenarioParams: SimulationParams) => {
    setAmountStr(String(scenarioParams.amount));
    setWeightStr(String(scenarioParams.weight));
    setDistanceStr(String(scenarioParams.distanceMeters));
    setDeliveryType(scenarioParams.deliveryType);
    setResolution(null);
    setLastCreatedOrder(null);
  };

  const handleCotizar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsQuoting(true);
    setLastCreatedOrder(null);

    const simulationParams: SimulationParams = {
      amount: numericAmount,
      weight: numericWeight,
      distanceMeters: numericDistance,
      deliveryType,
    };

    try {
      const result = await pedidosService.cotizarResolucion(simulationParams, rules);
      setResolution(result);
      setShowCollisions(result.collidedRules.length > 0);
      showToast(
        'success',
        'Regla Ganadora Determinada',
        `Courier: ${result.courier} | Prioridad #${result.winningRule.priority} (${result.collidedRules.length} colisiones detectadas)`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cotizar despacho';
      showToast('error', 'Error en motor de reglas', msg);
    } finally {
      setIsQuoting(false);
    }
  };

  const handleSimularPago = async () => {
    if (!resolution) return;

    setIsPaying(true);
    try {
      const order = await pedidosService.simularPagoYConfirmacion(resolution.winningRule.id, {
        amount: numericAmount,
        weight: numericWeight,
        distanceMeters: numericDistance,
        deliveryType,
      });

      setLastCreatedOrder(order);
      onOrderCreated(order);
      showToast(
        'success',
        '¡Pago y Pedido Confirmados!',
        `Orden #${order.id.slice(0, 8)}... registrada exitosamente en backend.`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al procesar checkout y pago';
      showToast('error', 'Falla en el checkout', msg);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de escenarios rápidos */}
      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Escenarios Preconfigurados de Prueba Rápida
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {scenarios.map((sc, idx) => {
            const Icon = sc.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => applyScenario(sc.params)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-850/60 text-slate-300 text-xs font-medium text-left transition-all duration-200 ${sc.color}`}
              >
                <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="line-clamp-1">{sc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulario de Parámetros del Carrito (5 columnas en lg) */}
        <div className="lg:col-span-5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Variables del Carrito</h3>
                </div>
              </div>
              <Badge variant="indigo" size="sm">
                Inputs Motor
              </Badge>
            </div>

            <form onSubmit={handleCotizar} className="space-y-4">
              {/* Monto Total */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Monto total del carrito ($ CLP)
                </label>
                <div className="relative rounded-xl shadow-inner">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <span className="text-sm font-bold">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-850 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                    placeholder="Ej. 60000 o 544431"
                  />
                </div>
              </div>

              {/* Peso Total */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Peso total del paquete (kg)
                </label>
                <div className="relative rounded-xl shadow-inner">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Scale className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={weightStr}
                    onChange={(e) => setWeightStr(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-850 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                    placeholder="Ej. 15.5"
                  />
                </div>
              </div>

              {/* Distancia en Metros */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Distancia de entrega (metros)
                </label>
                <div className="relative rounded-xl shadow-inner">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={distanceStr}
                    onChange={(e) => setDistanceStr(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-850 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                    placeholder="Ej. 400 o 544431"
                  />
                </div>
              </div>

              {/* Tipo de Entrega */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Modalidad de Entrega
                </label>
                <div className="relative">
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value as DeliveryType)}
                    className="w-full px-3.5 py-2.5 bg-slate-850 border border-slate-700/80 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="HOME_DELIVERY">HOME_DELIVERY - Despacho a Domicilio</option>
                    <option value="STORE_PICKUP">STORE_PICKUP - Retiro en Tienda (Gratis)</option>
                    <option value="PUDO">PUDO - Punto de Retiro Conveniente</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Botón Destacado: Cotizar Despacho */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isQuoting}
                  className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.99]"
                >
                  {isQuoting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Consultando Motor de Reglas...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Cotizar Despacho</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Reglas activas en memoria: {rules.filter((r) => r.isActive).length}</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              TypeORM Engine Online
            </span>
          </div>
        </div>

        {/* Panel de Resolución Dinámica y Colisiones (7 columnas en lg) */}
        <div className="lg:col-span-7 space-y-6">
          {!resolution ? (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[360px]">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Truck className="w-8 h-8 opacity-80" />
              </div>
              <h4 className="text-base font-semibold text-slate-200 mb-1">
                Motor a la espera de cotización
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
                Ingresa los datos del carrito o selecciona un escenario preconfigurado y haz clic en{' '}
                <strong className="text-indigo-300">"Cotizar Despacho"</strong> para evaluar en vivo
                la jerarquía de políticas y detectar colisiones.
              </p>
              <button
                type="button"
                onClick={() => handleCotizar()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-indigo-400 border border-indigo-500/30 text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Ejecutar Cotización Inicial
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* Card de Regla Ganadora Resaltada en Verde */}
              <div
                className={`relative overflow-hidden rounded-2xl border-2 p-6 shadow-2xl transition-all duration-300 ${
                  resolution.isFallback
                    ? 'border-amber-500/60 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 shadow-amber-950/20'
                    : 'border-emerald-500/60 bg-gradient-to-br from-slate-900 via-emerald-950/25 to-slate-900 shadow-emerald-950/30'
                }`}
              >
                {/* Glow decorativo de fondo */}
                <div
                  className={`absolute -top-24 -right-24 w-60 h-60 rounded-full blur-3xl pointer-events-none opacity-20 ${
                    resolution.isFallback ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                />

                {/* Header de la Card Ganadora */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 ${
                        resolution.isFallback
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {resolution.isFallback ? (
                        <AlertTriangle className="w-6 h-6" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          variant={resolution.isFallback ? 'amber' : 'emerald'}
                          size="md"
                          icon={<ShieldCheck className="w-3.5 h-3.5" />}
                        >
                          {resolution.isFallback
                            ? 'Regla Fallback de Emergencia'
                            : 'Ganadora por Prioridad'}
                        </Badge>
                        <span className="text-xs font-mono text-slate-400">
                          Prioridad #{resolution.winningRule.priority}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-100 text-lg mt-1">
                        {resolution.winningRule.name}
                      </h3>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Costo Final de Despacho
                    </span>
                    {resolution.isFree ? (
                      <div className="flex sm:justify-end items-center gap-1.5 mt-0.5">
                        <span className="text-2xl font-black text-emerald-400 tracking-tight">
                          $0
                        </span>
                        <Badge variant="emerald" size="sm">
                          {deliveryType === 'STORE_PICKUP'
                            ? 'Gratis (Retiro)'
                            : 'Envío Gratis'}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-2xl font-black text-slate-100 tracking-tight font-mono">
                        ${resolution.finalCost.toLocaleString('es-CL')} CLP
                      </span>
                    )}
                  </div>
                </div>

                {/* Métricas clave de la resolución */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-800/80">
                  <div className="bg-slate-850/70 rounded-xl p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Courier Asignado</span>
                    <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-sm">
                      {deliveryType === 'STORE_PICKUP' ? (
                        <Store className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span className="truncate">{resolution.courier}</span>
                    </div>
                  </div>

                  <div className="bg-slate-850/70 rounded-xl p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Plazo Estimado</span>
                    <span className="text-slate-200 font-semibold text-sm">
                      {resolution.estimatedDays === 0
                        ? 'Inmediato / Mismo día'
                        : `${resolution.estimatedDays} día${resolution.estimatedDays > 1 ? 's' : ''} hábil${resolution.estimatedDays > 1 ? 'es' : ''}`}
                    </span>
                  </div>

                  <div className="bg-slate-850/70 rounded-xl p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Tipo de Despacho</span>
                    <span className="text-slate-200 font-medium text-xs font-mono">
                      {deliveryType}
                    </span>
                  </div>

                  <div className="bg-slate-850/70 rounded-xl p-3 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Colisiones</span>
                    <span
                      className={`font-semibold text-sm ${
                        resolution.collidedRules.length > 0 ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      {resolution.collidedRules.length}{' '}
                      {resolution.collidedRules.length === 1 ? 'regla' : 'reglas'}
                    </span>
                  </div>
                </div>

                {/* Botón de Simulación de Pago y Confirmación */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    Confirma y genera la orden en la base de datos persistiendo el log de colisión.
                  </p>
                  <button
                    type="button"
                    onClick={handleSimularPago}
                    disabled={isPaying}
                    className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isPaying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Persistiendo Orden...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Simular Pago y Confirmación</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Mensaje de orden creada si se completó el pago */}
              {lastCreatedOrder && (
                <div className="bg-emerald-950/30 border border-emerald-500/40 rounded-2xl p-4 animate-slide-in flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <PackageCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-emerald-300 text-sm">
                          ¡Orden Guardada en Base de Datos!
                        </span>
                        <Badge variant="emerald" size="sm">
                          {lastCreatedOrder.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 font-mono">
                        ID: {lastCreatedOrder.id}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Courier: {lastCreatedOrder.appliedCourier} | Costo Despacho: $
                        {lastCreatedOrder.shippingCost?.toLocaleString('es-CL')} CLP | Colisiones:{' '}
                        {lastCreatedOrder.hadCollision ? 'Sí (Persistidas)' : 'No'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onNavigateToOrders}
                    className="shrink-0 text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold underline underline-offset-4 p-1"
                  >
                    Ver en Visualizador
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Sección Desplegable de Colisiones Detectadas */}
              <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
                <button
                  type="button"
                  onClick={() => setShowCollisions(!showCollisions)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-850/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl border ${
                        resolution.collidedRules.length > 0
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-200 text-sm">
                          Colisiones de Políticas Detectadas
                        </h4>
                        <Badge
                          variant={resolution.collidedRules.length > 0 ? 'amber' : 'slate'}
                          size="sm"
                        >
                          {resolution.collidedRules.length} colisi
                          {resolution.collidedRules.length === 1 ? 'ón' : 'ones'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400">
                        {resolution.collidedRules.length > 0
                          ? 'Reglas que también cumplían los requisitos pero fueron descartadas por prioridad.'
                          : 'No hubo reglas colisionantes en este rango; únicamente la ganadora cumplió.'}
                      </p>
                    </div>
                  </div>
                  <div className="text-slate-400 p-1">
                    {showCollisions ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {showCollisions && resolution.collidedRules.length > 0 && (
                  <div className="p-4 pt-1 space-y-2.5 border-t border-slate-800/80 bg-slate-950/40">
                    {resolution.collidedRules.map((col) => (
                      <CollisionCard
                        key={col.id}
                        collision={col}
                        winnerPriority={resolution.winningRule.priority}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
