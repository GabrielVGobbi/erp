import { Package, Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
}

export default function EmptyState({
    title,
    description,
    icon: Icon = Package,
    action
}: EmptyStateProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-gray-400" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                </h3>

                {description && (
                    <p className="text-gray-600 mb-6 max-w-md">
                        {description}
                    </p>
                )}

                {action && (
                    <div>
                        {action.href ? (
                            <Link
                                href={action.href}
                                className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                {action.label}
                            </Link>
                        ) : (
                            <button
                                onClick={action.onClick}
                                className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                {action.label}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
