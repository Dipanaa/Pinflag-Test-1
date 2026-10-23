import { useState, useEffect, useCallback } from 'react';
import {
  Truck,
  ArrowDownUp,
  Package,
  RefreshCw,
  Layers,
} from 'lucide-react';
import type { MotorRegla } from './types/regla.types';
import type { Pedido } from './types/pedido.types';
import { reglasService } from './services/reglas.service';
import { pedidosService } from './services/pedidos.service';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/Toast';
import type { ToastMessage, ToastType } from './components/common/Toast';
import { CheckoutSimulator } from './components/checkout/CheckoutSimulator';
import { RulesManager } from './components/rules/RulesManager';
import { OrdersViewer } from './components/orders/OrdersViewer';

type ActiveTab = 'checkout' | 'rules' | 'orders';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('checkout');
  const [rules, setRules] = useState<MotorRegla[]>([]);
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Función para mostrar notificaciones toast
  const showToast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, description }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cargar reglas desde backend
  const loadRules = useCallback(async () => {
    try {
      const fetched = await reglasService.getReglas();
      setRules(fetched);
      setIsBackendConnected(true);
    } catch {
      setIsBackendConnected(false);
      showToast('error', 'Error al conectar con el backend', 'No se pudieron obtener las reglas de despacho.');
    }
  }, [showToast]);

  // Cargar pedidos desde backend
  const loadOrders = useCallback(async () => {
    try {
      const fetched = await pedidosService.getPedidos();
      setOrders(fetched);
      setIsBackendConnected(true);
    } catch {
      setIsBackendConnected(false);
    }
  }, []);

  // Sincronización general
  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([loadRules(), loadOrders()]);
    setIsLoading(false);
  }, [loadRules, loadOrders]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Callback cuando se crea una nueva orden en el simulador
  const handleOrderCreated = (newOrder: Pedido) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const activeRulesCount = rules.filter((r) => r.isActive).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Top Navigation */}
      <Navbar
        activeRulesCount={activeRulesCount}
        totalOrdersCount={orders.length}
        isBackendConnected={isBackendConnected}
        onRefreshAll={refreshAll}
        isLoading={isLoading}
      />

      {/* Main Workspace Layout with Right-Side Tabs */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col-reverse lg:flex-row gap-8 items-start">
          {/* Main Content Area (Panel Activo) */}
          <div className="flex-1 w-full min-w-0">
            {isLoading && rules.length === 0 ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/40 rounded-3xl border border-slate-800">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
                <h3 className="text-base font-semibold text-slate-200">
                  Conectando con Motor NestJS TypeORM...
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Cargando matriz de políticas y órdenes persistidas
                </p>
              </div>
            ) : (
              <>
                {activeTab === 'checkout' && (
                  <CheckoutSimulator
                    rules={rules}
                    onOrderCreated={handleOrderCreated}
                    onNavigateToOrders={() => setActiveTab('orders')}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'rules' && (
                  <RulesManager
                    rules={rules}
                    isLoading={isLoading}
                    onRefresh={loadRules}
                    showToast={showToast}
                  />
                )}

                {activeTab === 'orders' && (
                  <OrdersViewer
                    orders={orders}
                    isLoading={isLoading}
                    onRefresh={loadOrders}
                    showToast={showToast}
                  />
                )}
              </>
            )}
          </div>

          {/* Panel de Pestañas al lado derecho */}
          <aside className="w-full lg:w-80 shrink-0 sticky top-24">
            <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-4 shadow-2xl">
              <div className="flex items-center justify-between px-2 pb-3 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Navegación de Módulos
                </span>
                <span className="text-[10px] text-slate-500 font-mono">v1.0.0</span>
              </div>

              <nav className="flex flex-col gap-2">
                {/* Pestaña 1: Simulador de Carrito y Checkout */}
                <button
                  type="button"
                  onClick={() => setActiveTab('checkout')}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all duration-200 group relative ${
                    activeTab === 'checkout'
                      ? 'bg-gradient-to-r from-indigo-600/20 via-indigo-500/15 to-transparent border border-indigo-500/40 text-slate-100 shadow-md shadow-indigo-950/40'
                      : 'hover:bg-slate-850/60 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                      activeTab === 'checkout'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:text-slate-200 group-hover:border-slate-600'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-100 block">
                        Simulador de Carrito
                      </span>
                      {activeTab === 'checkout' && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      Cotización, resolución por prioridad y colisiones
                    </span>
                  </div>
                </button>

                {/* Pestaña 2: Gestor de Reglas y Jerarquía */}
                <button
                  type="button"
                  onClick={() => setActiveTab('rules')}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all duration-200 group relative ${
                    activeTab === 'rules'
                      ? 'bg-gradient-to-r from-emerald-600/20 via-emerald-500/15 to-transparent border border-emerald-500/40 text-slate-100 shadow-md shadow-emerald-950/40'
                      : 'hover:bg-slate-850/60 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                      activeTab === 'rules'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:text-slate-200 group-hover:border-slate-600'
                    }`}
                  >
                    <ArrowDownUp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-100 block">
                        Gestor de Reglas
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-emerald-400">
                        {activeRulesCount}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      Matriz de políticas, Drag & Drop y fallback
                    </span>
                  </div>
                </button>

                {/* Pestaña 3: Visualizador de Pedidos */}
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-start gap-3.5 p-3.5 rounded-2xl text-left transition-all duration-200 group relative ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-purple-600/20 via-purple-500/15 to-transparent border border-purple-500/40 text-slate-100 shadow-md shadow-purple-950/40'
                      : 'hover:bg-slate-850/60 border border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700 group-hover:text-slate-200 group-hover:border-slate-600'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-slate-100 block">
                        Visualizador de Pedidos
                      </span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-purple-400">
                        {orders.length}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      Historial de compras y auditoría de colisiones
                    </span>
                  </div>
                </button>
              </nav>

              {/* Pie informativo del panel lateral */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Resolución:</span>
                  <span className="text-slate-300 font-mono">ASC (1 &gt; 2 &gt; 3)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Emergencia:</span>
                  <span className="text-amber-400 font-mono">Fallback #999</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer sobrio */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          PINFLAG • Motor de Resolución de Reglas de Despacho y Checkout con Detección de Colisiones
        </p>
      </footer>
    </div>
  );
}

export default App;
