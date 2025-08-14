import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
    className?: string;
    size?: 'sm' | 'default' | 'lg';
}

const spinnerSizes = {
    sm: 'h-4 w-4',
    default: 'h-5 w-5',
    lg: 'h-6 w-6',
};

const Spinner: React.FC<SpinnerProps> = ({ className, size = 'default' }) => {
    return (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-current border-t-transparent',
                spinnerSizes[size],
                className
            )}
            aria-hidden="true"
        />
    );
};

export default Spinner;
