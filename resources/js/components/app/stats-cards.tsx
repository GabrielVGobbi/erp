import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'amber' | 'green' | 'blue' | 'red' | 'gray';
}

interface StatsCardsProps {
    cards: StatCardProps[];
}

const colorClasses = {
    amber: {
        bg: 'bg-amber-50',
        icon: 'text-amber-600',
        iconBg: 'bg-amber-100'
    },
    green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        iconBg: 'bg-green-100'
    },
    blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100'
    },
    red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        iconBg: 'bg-red-100'
    },
    gray: {
        bg: 'bg-gray-50',
        icon: 'text-gray-600',
        iconBg: 'bg-gray-100'
    }
};

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    color = 'gray'
}: StatCardProps) {
    const colors = colorClasses[color];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                        {value}
                    </p>
                    {description && (
                        <p className="text-sm text-gray-500 mt-1">
                            {description}
                        </p>
                    )}
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                                vs. mês anterior
                            </span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 ${colors.iconBg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
            </div>
        </div>
    );
}

export default function StatsCards({ cards }: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    );
}
