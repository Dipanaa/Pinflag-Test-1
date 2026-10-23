import React, { useState } from 'react';
import {
  ArrowDownUp,
  Plus,
  RefreshCw,
  Search,
  Filter,
  Info,
} from 'lucide-react';
import type { MotorRegla, CreateMotorReglaPayload, UpdateMotorReglaPayload } from '../../types/regla.types';
import { reglasService } from '../../services/reglas.service';
import { RuleCard } from './RuleCard';
import { RuleModal } from './RuleModal';

interface RulesManagerProps {
  rules: MotorRegla[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  showToast: (type: 'success' | 'error' | 'info', title: string, desc?: string) => void;
}

export const RulesManager: React.FC<RulesManagerProps> = ({
  rules,
  isLoading,
  onRefresh,
  showToast,
}) => {
  // Filtros y búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [filterActiveOnly, setFilterActiveOnly] = useState(false);

  // Estado para drag and drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  // Estado para modal de creación/edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<MotorRegla | null>(null);

  // Filtrado de reglas
  const filteredRules = rules.filter((rule) => {
    if (filterActiveOnly && !rule.isActive) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rule.name.toLowerCase().includes(q);
      const matchCourier = rule.targetCourier.toLowerCase().includes(q);
      return matchName || matchCourier;
    }
    return true;
  });

  const activeCount = rules.filter((r) => r.isActive).length;
  const highestNormalPriority = rules
    .filter((r) => r.priority < 999)
    .reduce((max, r) => Math.max(max, r.priority), 0);

  // Manejo de Drag and Drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    // Reglas normales vs fallback: No permitir arrastrar la fallback o soltar debajo de ella
    const sourceRule = filteredRules[draggedIndex];
    const targetRule = filteredRules[targetIndex];

    if (sourceRule.priority >= 999 || targetRule.priority >= 999) {
      showToast('info', 'Regla de Contingencia Fija', 'La regla Fallback #999 se mantiene siempre al final de la matriz.');
      setDraggedIndex(null);
      return;
    }

    // Clonamos la lista y reubicamos
    const reordered = [...rules];
    const itemToMove = reordered.find((r) => r.id === sourceRule.id);
    if (!itemToMove) return;

    const actualSourceIdx = reordered.findIndex((r) => r.id === sourceRule.id);
    const actualTargetIdx = reordered.findIndex((r) => r.id === targetRule.id);

    reordered.splice(actualSourceIdx, 1);
    reordered.splice(actualTargetIdx, 0, itemToMove);

    await persistNewPriorities(reordered);
    setDraggedIndex(null);
  };

  // Reordenamiento accesible mediante botones Up / Down
  const handleMoveUp = async (index: number) => {
    if (index <= 0) return;
    const ruleA = filteredRules[index];
    const ruleB = filteredRules[index - 1];

    if (ruleA.priority >= 999 || ruleB.priority >= 999) return;

    const reordered = [...rules];
    const idxA = reordered.findIndex((r) => r.id === ruleA.id);
    const idxB = reordered.findIndex((r) => r.id === ruleB.id);

    const temp = reordered[idxA];
    reordered[idxA] = reordered[idxB];
    reordered[idxB] = temp;

    await persistNewPriorities(reordered);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= filteredRules.length - 1) return;
    const ruleA = filteredRules[index];
    const ruleB = filteredRules[index + 1];

    if (ruleA.priority >= 999 || ruleB.priority >= 999) return;

    const reordered = [...rules];
    const idxA = reordered.findIndex((r) => r.id === ruleA.id);
    const idxB = reordered.findIndex((r) => r.id === ruleB.id);

    const temp = reordered[idxA];
    reordered[idxA] = reordered[idxB];
    reordered[idxB] = temp;

    await persistNewPriorities(reordered);
  };

  // Persistir nuevas prioridades en el backend
  const persistNewPriorities = async (orderedList: MotorRegla[]) => {
    setIsReordering(true);
    try {
      // Asignamos números de prioridad correlativos 1, 2, 3... manteniendo las de fallback >= 999
      let currentPriority = 1;
      const updates: { id: string; priority: number }[] = [];

      for (const rule of orderedList) {
        if (rule.priority >= 999) {
          // No alteramos el número 999 de la fallback
          continue;
        }
        if (rule.priority !== currentPriority) {
          updates.push({ id: rule.id, priority: currentPriority });
        }
        currentPriority++;
      }

      if (updates.length > 0) {
        await reglasService.reorderPriorities(updates);
        showToast(
          'success',
          'Jerarquía Actualizada',
          `Se actualizaron ${updates.length} prioridades en el motor con éxito.`
        );
        await onRefresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar prioridades';
      showToast('error', 'Error al reordenar', msg);
    } finally {
      setIsReordering(false);
    }
  };

  // Toggle activo/inactivo
  const handleToggleActive = async (rule: MotorRegla) => {
    try {
      await reglasService.updateRegla(rule.id, { isActive: !rule.isActive });
      showToast(
        'info',
        rule.isActive ? 'Regla Desactivada' : 'Regla Activada',
        `"${rule.name}" ahora está ${rule.isActive ? 'inactiva' : 'activa en la evaluación'}.`
      );
      await onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar estado';
      showToast('error', 'Error de actualización', msg);
    }
  };

  // Eliminar regla
  const handleDelete = async (rule: MotorRegla) => {
    if (rule.priority >= 999) {
      showToast('info', 'Operación no permitida', 'La regla Fallback de Emergencia no puede eliminarse.');
      return;
    }

    const confirm = window.confirm(`¿Estás seguro de eliminar la regla "${rule.name}"?`);
    if (!confirm) return;

    try {
      await reglasService.deleteRegla(rule.id);
      showToast('success', 'Regla Eliminada', `"${rule.name}" ha sido removida del motor.`);
      await onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar regla';
      showToast('error', 'Falla al eliminar', msg);
    }
  };

  // Guardar creación
  const handleSaveCreate = async (payload: CreateMotorReglaPayload) => {
    await reglasService.createRegla(payload);
    showToast('success', 'Regla Creada', `"${payload.name}" registrada con prioridad #${payload.priority}.`);
    await onRefresh();
  };

  // Guardar edición
  const handleSaveUpdate = async (
    id: string,
    payload: UpdateMotorReglaPayload
  ) => {
    await reglasService.updateRegla(id, payload);
    showToast('success', 'Regla Actualizada', 'Los cambios han sido guardados en el backend.');
    await onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Banner de explicación de jerarquía y fallback */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 rounded-2xl border border-indigo-500/20 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              <ArrowDownUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">
                Matriz de Resolución por Prioridad Jerárquica
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                El motor de despacho evalúa las condiciones de menor a mayor entero de prioridad (
                <strong className="text-emerald-400">#1 gana sobre #2</strong>). Si varias reglas
                cumplen los filtros de monto, peso y distancia, se genera una{' '}
                <strong className="text-amber-400">colisión</strong> y la de prioridad numérica menor
                se adjudica el pedido.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => {
                setEditingRule(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Política</span>
            </button>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
              title="Refrescar reglas del backend"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Barra de Filtros, Búsqueda y Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-3">
        {/* Buscador */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o courier (Blue Express, FedEx...)"
            className="w-full pl-9 pr-3.5 py-1.5 bg-slate-850 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Toggle de Reglas Activas y Contador */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setFilterActiveOnly(!filterActiveOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              filterActiveOnly
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-850 text-slate-400 border-slate-700 hover:text-slate-300'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterActiveOnly ? 'Mostrando Solo Activas' : 'Todas las Reglas'}</span>
          </button>

          <span className="text-xs text-slate-400 font-mono">
            {filteredRules.length} {filteredRules.length === 1 ? 'regla' : 'reglas'} ({activeCount} activas)
          </span>
        </div>
      </div>

      {/* Indicador de reordenamiento activo */}
      {isReordering && (
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs flex items-center justify-center gap-2 font-medium animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Sincronizando nuevas prioridades con el motor NestJS TypeORM...</span>
        </div>
      )}

      {/* Lista de Tarjetas de Reglas */}
      {filteredRules.length === 0 ? (
        <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
          <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No se encontraron reglas que coincidan con el filtro.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRules.map((rule, idx) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              index={idx}
              totalRules={filteredRules.length}
              isDragging={draggedIndex === idx}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onToggleActive={handleToggleActive}
              onEdit={(r) => {
                setEditingRule(r);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal de Crear / Editar Regla */}
      <RuleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRule(null);
        }}
        onSaveCreate={handleSaveCreate}
        onSaveUpdate={handleSaveUpdate}
        editingRule={editingRule}
        currentHighestPriority={highestNormalPriority}
      />
    </div>
  );
};
