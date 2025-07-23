import { type BreadcrumbItem } from '@/types';
import { ChevronRight, Plus } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface PageHeaderProps {
    title: string;
    breadcrumbs?: BreadcrumbItem[];
    addButton?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    totalRecords?: number;
    description?: string;
}

export default function PageHeader({
    title,
    breadcrumbs,
    addButton,
    totalRecords,
    description
}: PageHeaderProps) {
    return (
        <div className="mb-6">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-4">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500">
                        {breadcrumbs.map((breadcrumb, index) => (
                            <li key={index} className="flex items-center">
                                {index > 0 && (
                                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                                )}
                                {index === breadcrumbs.length - 1 ? (
                                    <span className="text-gray-900 font-medium">
                                        {breadcrumb.title}
                                    </span>
                                ) : (
                                    <Link
                                        href={breadcrumb.href}
                                        className="hover:text-primary transition-colors duration-200"
                                    >
                                        {breadcrumb.title}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            )}

            {/* Header Content */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-gray-600 mt-1">
                            {description}
                        </p>
                    )}
                    {totalRecords !== undefined && (
                        <p className="text-sm text-gray-500 mt-2">
                            Total de {totalRecords} {totalRecords === 1 ? 'registro' : 'registros'}
                        </p>
                    )}
                </div>

                {/* Add Button */}
                {addButton && (
                    <div>
                        {addButton.href ? (
                            <Link
                                href={addButton.href}
                                className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                {addButton.label}
                            </Link>
                        ) : (
                            <button
                                onClick={addButton.onClick}
                                className="inline-flex items-center gap-2 bg-primary hover:bg-secondary text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                            >
                                <Plus className="w-4 h-4" />
                                {addButton.label}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
