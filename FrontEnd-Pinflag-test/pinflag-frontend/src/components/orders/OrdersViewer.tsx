import React, { useState } from 'react';
import {
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import type { Pedido } from '../../types/pedido.types';
import { Badge } from '../common/Badge';

interface OrdersViewerProps {
  orders: Pedido[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  showToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const OrdersViewer: React.FC<OrdersViewerProps> = ({
  orders,
  isLoading,
  onRefresh,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourier, setFilterCourier] = useState<string>('ALL');
  const [filterCollision, setFilterCollision] = useState<'ALL' | 'COLLISION' | 'NO_COLLISION'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Cálculos de estadísticas rápidas
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const collisionCount = orders.filter((o) => o.hadCollision).length;
  const collisionRate = totalOrders > 0 ? ((collisionCount / totalOrders) * 100).toFixed(0) : '0';

  // Identificar courier más asignado
  const courierCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.appliedCourier] = (acc[o.appliedCourier] || 0) + 1;
    return acc;
  }, {});
  const topCourier = Object.entries(courierCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  // Filtrado de pedidos
  const filteredOrders = orders.filter((order) => {
    if (filterCourier !== 'ALL' && order.appliedCourier !== filterCourier) return false;
    if (filterCollision === 'COLLISION' && !order.hadCollision) return false;
    if (filterCollision === 'NO_COLLISION' && order.hadCollision) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCourier = order.appliedCourier.toLowerCase().includes(q);
      const matchDelivery = order.deliveryType.toLowerCase().includes(q);
      return matchId || matchCourier || matchDelivery;
    }
    return true;
  });

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    showToast('info', 'ID Copiado', 'UUID copiado al portapapeles.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('es-CL', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  const courierColor = (courier: string) => {
    const c = courier.toLowerCase();
    if (c.includes('blue')) return 'blue';
    if (c.includes('fedex')) return 'purple';
    if (c.includes('chile')) return 'rose';
    if (c.includes('star')) return 'amber';
    return 'indigo';
  };

  return (
    <div className="space-y-6">
      {/* Tarjetas KPI de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pedidos Totales</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100">{totalOrders}</span>
            <span className="text-xs text-emerald-400 font-medium">Procesados</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Monto Facturado</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-100 font-mono">
              ${totalRevenue.toLocaleString('es-CL')}
            </span>
            <span className="text-xs text-slate-400 font-medium">CLP</span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasa de Colisión</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-400">{collisionRate}%</span>
            <span className="text-xs text-slate-400 font-medium">
              ({collisionCount} órdenes con colisión)
            </span>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Courier Principal</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-100 truncate">{topCourier}</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-3.5">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por ID, courier o modalidad..."
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-850 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtro por Courier */}
          <select
            value={filterCourier}
            onChange={(e) => setFilterCourier(e.target.value)}
            className="px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Todos los Couriers</option>
            {Object.keys(courierCounts).map((c) => (
              <option key={c} value={c}>
                {c} ({courierCounts[c]})
              </option>
            ))}
          </select>

          {/* Filtro por Colisiones */}
          <select
            value={filterCollision}
            onChange={(e) => setFilterCollision(e.target.value as 'ALL' | 'COLLISION' | 'NO_COLLISION')}
            className="px-3 py-1.5 bg-slate-850 border border-slate-700 rounded-xl text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Todas las Órdenes</option>
            <option value="COLLISION">Solo con Colisiones</option>
            <option value="NO_COLLISION">Sin Colisiones</option>
          </select>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
            title="Refrescar pedidos del backend"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Lista de Órdenes */}
      {filteredOrders.length === 0 ? (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-400" />
          <h4 className="font-semibold text-slate-300 text-sm mb-1">
            No hay pedidos registrados
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Ve a la pestaña "Simulador de Carrito y Checkout" para cotizar y simular el primer pago
            con resolución de políticas en vivo.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
              className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
                selectedOrder?.id === order.id
                  ? 'bg-slate-850/90 border-indigo-500/50 shadow-lg shadow-indigo-950/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Lado Izquierdo: ID, Fecha, Courier y Estado */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                    <Package className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(order.id);
                        }}
                        className="font-mono text-xs text-slate-300 hover:text-indigo-400 flex items-center gap-1 font-semibold group bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700"
                        title="Haz clic para copiar el UUID"
                      >
                        <span>#{order.id.slice(0, 8)}...</span>
                        {copiedId === order.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-500 group-hover:text-slate-300" />
                        )}
                      </button>

                      <Badge variant={courierColor(order.appliedCourier)} size="sm">
                        {order.appliedCourier}
                      </Badge>

                      <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                        {order.status}
                      </Badge>

                      {order.hadCollision && (
                        <Badge
                          variant="amber"
                          size="sm"
                          icon={<AlertTriangle className="w-3 h-3" />}
                        >
                          Colisión Detectada
                        </Badge>
                      )}

                      {order.isFallbackApplied && (
                        <Badge variant="rose" size="sm">
                          Fallback
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {formatDate(order.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">{order.deliveryType}</span>
                    </div>
                  </div>
                </div>

                {/* Lado Central: Variables del Pedido */}
                <div className="grid grid-cols-3 gap-3 text-xs bg-slate-850/60 rounded-xl p-2.5 border border-slate-800 shrink-0">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Monto Carrito
                    </span>
                    <span className="font-mono font-bold text-slate-100">
                      ${Number(order.amount).toLocaleString('es-CL')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Peso
                    </span>
                    <span className="font-mono text-slate-300">{order.weight} kg</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Distancia
                    </span>
                    <span className="font-mono text-slate-300">{order.distanceMeters} m</span>
                  </div>
                </div>

                {/* Lado Derecho: Costo de Despacho y Días */}
                <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                      Costo Despacho
                    </span>
                    {Number(order.shippingCost) === 0 ? (
                      <Badge variant="emerald" size="sm">
                        Gratis
                      </Badge>
                    ) : (
                      <span className="font-mono font-bold text-slate-200 text-sm">
                        ${Number(order.shippingCost).toLocaleString('es-CL')} CLP
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {order.estimatedDeliveryDays} d hábiles
                    </span>
                  </div>

                  <div className="text-slate-500">
                    <ChevronRight
                      className={`w-5 h-5 transition-transform ${
                        selectedOrder?.id === order.id ? 'rotate-90 text-indigo-400' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Vista Expandida de Detalles de la Orden */}
              {selectedOrder?.id === order.id && (
                <div className="mt-4 pt-4 border-t border-slate-800/80 bg-slate-950/40 rounded-xl p-4 animate-fade-in space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-slate-200 text-xs flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Auditoría Inmutable de Resolución (Snapshot)
                    </h5>
                    <span className="text-[11px] text-slate-500 font-mono">
                      UUID Completo: {order.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Regla de Despacho Ganadora
                      </span>
                      <p className="font-semibold text-slate-200">
                        {order.appliedRule?.name || `${order.appliedCourier} (Asignada)`}
                      </p>
                      {order.appliedRule?.priority && (
                        <span className="text-[11px] text-indigo-400 font-mono">
                          Prioridad #{order.appliedRule.priority}
                        </span>
                      )}
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Registro de Colisiones
                      </span>
                      <p className="font-semibold text-slate-200">
                        {order.hadCollision
                          ? 'Generó colisión en backend (Persistida en tabla reglas_colisionadas)'
                          : 'Sin colisión de políticas'}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {order.hadCollision
                          ? 'Se descartaron reglas de menor prioridad.'
                          : 'Única regla que cumplió todos los filtros.'}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <span className="text-[11px] text-slate-400 block mb-1">
                        Estado y Contingencia
                      </span>
                      <p className="font-semibold text-slate-200">
                        {order.isFallbackApplied
                          ? 'Regla de Contingencia Fallback Aplicada'
                          : 'Regla Estándar de Catálogo'}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        Estado de orden: {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
