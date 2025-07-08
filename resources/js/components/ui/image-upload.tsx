import React, { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
    label?: string;
    value?: string;
    onChange: (file: File | null, url: string) => void;
    accept?: string;
    maxSize?: number; // in MB
    required?: boolean;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
}

export default function ImageUpload({
    label = "Imagen",
    value = "",
    onChange,
    accept = "image/*",
    maxSize = 5,
    required = false,
    disabled = false,
    className = "",
    placeholder = "Arrastra una imagen aquí o haz clic para seleccionar"
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (!file.type.startsWith('image/')) {
            return 'El archivo debe ser una imagen';
        }

        if (file.size > maxSize * 1024 * 1024) {
            return `El archivo no puede ser mayor a ${maxSize}MB`;
        }

        return null;
    };

    const handleFileSelect = useCallback(async (file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        setIsUploading(true);

        try {
            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            onChange(file, previewUrl);
        } catch {
            setError('Error al procesar la imagen');
        } finally {
            setIsUploading(false);
        }
    }, [onChange, maxSize]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, [disabled, handleFileSelect]);

    const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    }, [handleFileSelect]);

    const handleRemove = useCallback(() => {
        if (value && value.startsWith('blob:')) {
            URL.revokeObjectURL(value);
        }
        onChange(null, '');
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [value, onChange]);

    const handleClick = useCallback(() => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [disabled]);

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <Label className="text-sm font-medium">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}

            <div className="relative">
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileInputChange}
                    className="hidden"
                    disabled={disabled}
                />

                {/* Upload area */}
                <div
                    onClick={handleClick}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                        ${isDragging
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${error ? 'border-red-500' : ''}
                    `}
                >
                    {value ? (
                        <div className="relative">
                            <img
                                src={value}
                                alt="Preview"
                                className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                disabled={disabled}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {isUploading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                    <span className="text-sm text-gray-600">Subiendo...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-center">
                                        <div className="p-3 bg-gray-100 rounded-full">
                                            <Upload className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            {placeholder}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            PNG, JPG, GIF hasta {maxSize}MB
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
            </div>
        </div>
    );
}
