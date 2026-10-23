import React from 'react';
import { Truck, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeRulesCount: number;
  totalOrdersCount: number;
  isBackendConnected: boolean;
  onRefreshAll: () => Promise<void>;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRulesCount,
  totalOrdersCount,
  isBackendConnected,
  onRefreshAll,
  isLoading,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-slate-100 text-lg tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent">
                PINFLAG
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Rule Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Motor de Resolución de Reglas de Despacho & Checkout con Detección de Colisiones
            </p>
          </div>
        </div>

        {/* Right side: Stats & Connectivity */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${isBackendConnected
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-rose-400'
                }`}
            ></span>
            <span className="font-medium">
              {isBackendConnected ? 'NestJS API Conectada' : 'Desconectado'}
            </span>
          </div>

          {/* Quick Counters */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <strong className="text-emerald-400">{activeRulesCount}</strong> Reglas Activas
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <strong className="text-indigo-400">{totalOrdersCount}</strong> Pedidos
            </span>
          </div>

          {/* Refresh button */}
          <button
            type="button"
            onClick={onRefreshAll}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Sincronizar todo con backend"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};
