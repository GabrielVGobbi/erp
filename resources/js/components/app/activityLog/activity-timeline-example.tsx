import React from 'react';
import ActivityTimeline from './activity-timeline';
import TimelineActivityLog from './timeline-activity-log';

// Exemplo de dados de log
const sampleLogs = [
  {
    id: 1,
    column: 'status',
    old_value: 'pendente',
    new_value: 'aprovado',
    causer_id: 1,
    causer_name: 'João Silva',
    changed_at: '2025-01-23T10:30:00Z'
  },
  {
    id: 2,
    column: 'valor',
    old_value: 'R$ 1.000,00',
    new_value: 'R$ 1.500,00',
    causer_id: 2,
    causer_name: 'Maria Santos',
    changed_at: '2025-01-23T09:15:00Z'
  },
  {
    id: 3,
    column: 'categoria',
    old_value: 'básico',
    new_value: 'premium',
    causer_id: 1,
    causer_name: 'João Silva',
    changed_at: '2025-01-22T16:45:00Z'
  }
];

export default function ActivityTimelineExample() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Componente ActivityTimeline</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ActivityTimeline logs={sampleLogs} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Componente TimelineActivityLog</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <TimelineActivityLog logs={sampleLogs} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Timeline Vazia</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <TimelineActivityLog logs={[]} />
        </div>
      </div>
    </div>
  );
}
