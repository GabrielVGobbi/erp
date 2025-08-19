import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityLog {
  id: number;
  column: string;
  old_value: string;
  new_value: string;
  causer_id: number;
  causer_name?: string;
  changed_at: string;
}

interface ActivityTimelineProps {
  logs: ActivityLog[];
  className?: string;
}

export default function ActivityTimeline({ logs, className = '' }: ActivityTimelineProps) {
  if (logs.length === 0) {
    return (
      <div className={`timeline ${className}`}>
        <p className="text-gray-500 text-center py-4">
          Nenhuma alteração registrada.
        </p>
      </div>
    );
  }

  return (
    <div className={`timeline ${className}`}>
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded uppercase">
                    {log.column}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600 font-medium line-through">
                    {log.old_value}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-green-600 font-medium">
                    {log.new_value}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  por <span className="font-medium">{log.causer_name || 'Desconhecido'}</span>
                </div>
              </div>

              <div className="text-right text-sm text-gray-500 ml-4">
                <div className="font-medium">
                  {log.changed_at}
                </div>
                <div className="text-xs">
                                    {log.changed_at}

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
