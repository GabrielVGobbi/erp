import React from 'react';
import { useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'datetime-local' | 'custom';
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: { value: string | number; label: string }[];
    render?: (field: FormField, value: any, onChange: (value: any) => void, error?: string) => React.ReactNode;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
    className?: string;
    description?: string;
    colSpan?: 1 | 2 | 3;
}

export interface FormSection {
    title: string;
    description?: string;
    fields: FormField[];
    className?: string;
}

interface FormViewProps {
    title: string;
    subtitle?: string;
    backUrl?: string;
    submitUrl: string;
    method?: 'post' | 'put' | 'patch';
    initialData?: Record<string, any>;
    sections: FormSection[];
    onSuccess?: () => void;
    onError?: (errors: Record<string, string>) => void;
    className?: string;
    submitLabel?: string;
    showCancelButton?: boolean;
}

export default function FormView({
    title,
    subtitle,
    backUrl,
    submitUrl,
    method = 'post',
    initialData = {},
    sections,
    onSuccess,
    onError,
    className,
    submitLabel = 'Salvar',
    showCancelButton = true
}: FormViewProps) {
    const { data, setData, post, put, patch, processing, errors, reset } = useForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitMethod = method === 'post' ? post : method === 'put' ? put : patch;

        submitMethod(submitUrl, {
            onSuccess: () => {
                onSuccess?.();
            },
            onError: (errors) => {
                onError?.(errors);
            }
        });
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        setData(fieldName, value);
    };

    const renderField = (field: FormField) => {
        const value = data[field.name];
        const error = errors[field.name];
        const fieldId = `field-${field.name}`;

        if (field.render) {
            return field.render(field, value, (newValue) => handleFieldChange(field.name, newValue), error);
        }

        const commonProps = {
            id: fieldId,
            disabled: field.disabled || processing,
            className: cn(error && "border-destructive", field.className)
        };

        switch (field.type) {
            case 'textarea':
                return (
                    <Textarea
                        {...commonProps}
                        placeholder={field.placeholder}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        rows={4}
                    />
                );

            case 'select':
                return (
                    <Select
                        value={value || ''}
                        onValueChange={(newValue) => handleFieldChange(field.name, newValue)}
                        disabled={field.disabled || processing}
                    >
                        <SelectTrigger className={cn(error && "border-destructive", field.className)}>
                            <SelectValue placeholder={field.placeholder || `Selecione ${field.label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={String(option.value)}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={fieldId}
                            checked={value || false}
                            onCheckedChange={(checked) => handleFieldChange(field.name, checked)}
                            disabled={field.disabled || processing}
                            className={cn(error && "border-destructive")}
                        />
                        <Label htmlFor={fieldId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {field.label}
                        </Label>
                    </div>
                );

            default:
                return (
                    <Input
                        {...commonProps}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={value || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        required={field.required}
                    />
                );
        }
    };

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-4">
                        {backUrl && (
                            <Link href={backUrl}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                            {subtitle && (
                                <p className="text-muted-foreground">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {sections.map((section, sectionIndex) => (
                    <Card key={sectionIndex} className={section.className}>
                        <CardHeader>
                            <CardTitle>{section.title}</CardTitle>
                            {section.description && (
                                <p className="text-sm text-muted-foreground">{section.description}</p>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {section.fields.map((field) => {
                                    const error = errors[field.name];
                                    const colSpanClass = field.colSpan === 2 ? 'md:col-span-2' :
                                        field.colSpan === 3 ? 'md:col-span-3' : '';

                                    if (field.type === 'checkbox') {
                                        return (
                                            <div key={field.name} className={cn("space-y-1", colSpanClass)}>
                                                {renderField(field)}
                                                {field.description && (
                                                    <p className="text-xs text-muted-foreground">{field.description}</p>
                                                )}
                                                {error && (
                                                    <p className="text-xs text-destructive">{error}</p>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div key={field.name} className={cn("space-y-2", colSpanClass)}>
                                            <Label htmlFor={`field-${field.name}`} className="text-sm font-medium">
                                                {field.label}
                                                {field.required && <span className="text-destructive ml-1">*</span>}
                                            </Label>
                                            {renderField(field)}
                                            {field.description && (
                                                <p className="text-xs text-muted-foreground">{field.description}</p>
                                            )}
                                            {error && (
                                                <p className="text-xs text-destructive">{error}</p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>

                        <CardContent className="pt-4">
                            <div className="flex items-center justify-end gap-4">
                                {showCancelButton && backUrl && (
                                    <Link href={backUrl}>
                                        <Button type="button" variant="outline">
                                            <X className="h-4 w-4 mr-2" />
                                            Cancelar
                                        </Button>
                                    </Link>
                                )}
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Salvando...' : submitLabel}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}


            </form>
        </div>
    );
}
