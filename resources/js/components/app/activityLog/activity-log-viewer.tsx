import React from 'react';
import { RefreshCw } from 'lucide-react';
import TimelineActivityLog from '../../TimelineActivityLog';
import { useActivityLogs } from '../../../hooks/use-activity-logs';

interface ActivityLogViewerProps {
  modelType?: string;
  modelId?: number;
  logs?: Array<{
    id: number;
    column: string;
    old_value: string;
    new_value: string;
    causer_id: number;
    causer_name?: string;
    changed_at: string;
  }>;
  title?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  className?: string;
}

export default function ActivityLogViewer({
  modelType,
  modelId,
  logs: propLogs,
  title = 'Histórico de Alterações',
  autoRefresh = false,
  refreshInterval = 30000,
  className = ''
}: ActivityLogViewerProps) {
  const {
    logs: fetchedLogs,
    loading,
    error,
    refreshLogs,
    isEmpty
  } = useActivityLogs({
    modelType,
    modelId,
    autoRefresh,
    refreshInterval
  });

  // Use logs passados como props ou logs buscados via hook
  const logs = propLogs || fetchedLogs;
  const showRefreshButton = modelType && modelId;

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-2 text-red-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Erro ao carregar histórico</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

        {showRefreshButton && (
          <button
            onClick={refreshLogs}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {loading && logs.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-gray-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Carregando histórico...</span>
            </div>
          </div>
        ) : (
          <TimelineActivityLog logs={logs.data} />
        )}
      </div>
    </div>
  );
}
