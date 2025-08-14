import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

// Define props for the BackButton component
interface BackButtonProps {
    backUrl?: string; // Optional backUrl prop
    label?: string; // Optional label for the button
    variant?: 'ghost' | 'outline' | 'default'; // Button variant
    size?: 'sm' | 'default' | 'lg'; // Button size
    className?: string; // Additional classes
}

// Use a default backUrl (can be overridden via context or props)
const DEFAULT_BACK_URL = '/dashboard'; // Fallback URL

const BackButton: React.FC<BackButtonProps> = ({
    backUrl = DEFAULT_BACK_URL,
    label = 'Voltar',
    variant = 'ghost',
    size = 'default',
    className = '',
}) => {
    // Optional: Add logic to disable the button during form processing (can be passed as prop if needed)
    return (
        <Link href={backUrl}>
            <Button variant={variant} size={size} className={`flex items-center gap-2 ${className}`} aria-label="Voltar para a página anterior">
                <ArrowLeft className="h-4 w-4" />
                {label}
            </Button>
        </Link>
    );
};

export default BackButton;
