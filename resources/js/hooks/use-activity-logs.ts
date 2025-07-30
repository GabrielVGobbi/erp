import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface ActivityLog {
  id: number;
  column: string;
  old_value: string;
  new_value: string;
  causer_id: number;
  causer_name?: string;
  changed_at: string;
}

interface UseActivityLogsProps {
  modelType?: string;
  modelId?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useActivityLogs({
  modelType,
  modelId,
  autoRefresh = false,
  refreshInterval = 30000
}: UseActivityLogsProps = {}) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    if (!modelType || !modelId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/activity-logs/${modelType}/${modelId}`);

      if (!response.ok) {
        throw new Error('Erro ao carregar logs de atividade');
      }

      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const refreshLogs = () => {
    fetchLogs();
  };

  useEffect(() => {
    fetchLogs();
  }, [modelType, modelId]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchLogs, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, modelType, modelId]);

  return {
    logs,
    loading,
    error,
    refreshLogs,
    isEmpty: logs.length === 0
  };
}
