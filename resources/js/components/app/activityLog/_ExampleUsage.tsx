import React from 'react';
import { Head } from '@inertiajs/react';
import ActivityLogViewer from './activity-log-viewer';

interface Props {
  logs?: Array<{
    id: number;
    column: string;
    old_value: string;
    new_value: string;
    causer_id: number;
    causer_name?: string;
    changed_at: string;
  }>;
}

export default function ExampleUsage({ logs }: Props) {
  return (
    <>
      <Head title="Exemplo de Uso - Activity Log" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Exemplo de Uso do Activity Log
            </h1>
            <p className="text-gray-600">
              Demonstração dos componentes de linha do tempo para logs de atividade
            </p>
          </div>

          <div className="space-y-8">
            {/* Usando com dados passados via props do Laravel */}
            <ActivityLogViewer
              logs={logs}
              title="Histórico de Alterações (Props)"
              className="shadow-sm"
            />

            {/* Usando com busca automática via API */}
            <ActivityLogViewer
              modelType="user"
              modelId={1}
              title="Histórico do Usuário #1 (API)"
              autoRefresh={true}
              refreshInterval={30000}
              className="shadow-sm"
            />

            {/* Exemplo com dados vazios */}
            <ActivityLogViewer
              logs={[]}
              title="Timeline Vazia"
              className="shadow-sm"
            />
          </div>
        </div>
      </div>
    </>
  );
}
