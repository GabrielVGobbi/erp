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

interface TimelineActivityLogProps {
    logs: ActivityLog[];
    className?: string;
}

export default function TimelineActivityLog({ logs, className = '' }: TimelineActivityLogProps) {

    if (logs.length === 0) {
        return (
            <div className={`timeline-container ${className}`}>
                <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500 text-center">
                        Nenhuma alteração registrada.
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className={`timeline-container ${className}`}>
            <div className="relative">
                {/* Linha vertical da timeline */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="space-y-6">
                    {logs.map((log, index) => (
                        <div key={log.id} className="relative flex items-start">
                            {/* Ponto da timeline */}
                            <div className="absolute left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md z-10"></div>

                            {/* Conteúdo */}
                            <div className="ml-10 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-full">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        {/* Campo alterado */}
                                        <div className="mb-3">
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">
                                                {log.column}
                                            </span>
                                        </div>

                                        {/* Mudança de valor */}
                                        <div className="mb-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-red-600 font-medium bg-red-50 px-2 py-1 rounded text-sm">
                                                        {log.old_value}
                                                    </span>
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                    <span className="text-green-600 font-medium bg-green-50 px-2 py-1 rounded text-sm">
                                                        {log.new_value}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Autor */}
                                        <div className="text-sm text-gray-600">
                                            <span className="text-gray-500">por</span>{' '}
                                            <span className="font-medium text-gray-700">
                                                {log.causer_name || 'Desconhecido'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Data/hora */}
                                    <div className="text-right text-sm text-gray-500 ml-4 flex-shrink-0">
                                        <div className="font-medium">
                                                              {log.changed_at}

                                        </div>
                                        <div className="text-xs mt-1">
                                                              {log.changed_at}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
