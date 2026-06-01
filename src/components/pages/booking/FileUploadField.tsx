'use client'

import { FileText, Upload, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { cn } from '@/lib/utils/clsxUtils'

const MAX_SIZE_BYTES = 10 * 1024 * 1024

type UploadMode = 'document' | 'image'

const MODE_CONFIG: Record<
    UploadMode,
    { accept: string; hint: string; types: string[]; pattern: RegExp }
> = {
    document: {
        accept: '.pdf,.jpg,.jpeg',
        hint: 'PDF or JPG up to 10MB',
        types: ['application/pdf', 'image/jpeg', 'image/jpg'],
        pattern: /\.(pdf|jpe?g)$/i,
    },
    image: {
        accept: '.png,.jpg,.jpeg',
        hint: 'JPG or PNG up to 10MB',
        types: ['image/jpeg', 'image/jpg', 'image/png'],
        pattern: /\.(png|jpe?g)$/i,
    },
}

type FileUploadFieldProps = {
    label: string
    required?: boolean
    mode?: UploadMode
    hint?: string
    value?: File | null
    onChange?: (file: File | null) => void
    className?: string
}

function isAcceptedFile(file: File, mode: UploadMode) {
    const { types, pattern } = MODE_CONFIG[mode]
    if (types.includes(file.type)) return true
    return pattern.test(file.name)
}

export function FileUploadField({
    label,
    required,
    mode = 'document',
    hint,
    value = null,
    onChange,
    className,
}: FileUploadFieldProps) {
    const config = MODE_CONFIG[mode]
    const hintText = hint ?? config.hint
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState('')

    const processFile = useCallback(
        (file: File | null) => {
            if (!file) {
                setError('')
                onChange?.(null)
                return
            }

            if (!isAcceptedFile(file, mode)) {
                setError(mode === 'document' ? 'Only PDF or JPG files are allowed.' : 'Only JPG or PNG files are allowed.')
                onChange?.(null)
                return
            }

            if (file.size > MAX_SIZE_BYTES) {
                setError('File must be 10MB or smaller.')
                onChange?.(null)
                return
            }

            setError('')
            onChange?.(file)
        },
        [mode, onChange],
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null
        processFile(file)
        e.target.value = ''
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0] ?? null
        processFile(file)
    }

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <span className='text-sm font-medium text-neutral-700'>
                {label}
                {required && <span className='text-red-400'> *</span>}
            </span>

            <div
                role='button'
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        inputRef.current?.click()
                    }
                }}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                }}
                onDragLeave={(e) => {
                    e.preventDefault()
                    setIsDragging(false)
                }}
                onDrop={handleDrop}
                className={cn(
                    'flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed px-4 py-6 text-center transition-colors',
                    isDragging
                        ? 'border-primary-700 bg-primary-50'
                        : 'border-gray-300 bg-neutral-50 hover:border-primary-600 hover:bg-neutral-100',
                    error && 'border-red-400',
                )}
            >
                <input
                    ref={inputRef}
                    type='file'
                    accept={config.accept}
                    className='sr-only'
                    onChange={handleInputChange}
                />

                {value ? (
                    <>
                        <span className='flex h-10 w-10 items-center justify-center rounded-md bg-slate-200 text-primary-700'>
                            <FileText className='h-5 w-5' />
                        </span>
                        <span className='mt-3 max-w-full truncate px-2 text-sm font-medium text-neutral-800'>
                            {value.name}
                        </span>
                        <span className='mt-1 text-xs text-neutral-500'>Click or drop to replace</span>
                    </>
                ) : (
                    <>
                        <Upload className='h-5 w-5 text-neutral-500' />
                        <span className='mt-2 text-sm text-neutral-600'>Click to upload or drag and drop</span>
                        <span className='mt-1 text-xs text-neutral-400'>{hintText}</span>
                    </>
                )}
            </div>

            {value && (
                <button
                    type='button'
                    onClick={(e) => {
                        e.stopPropagation()
                        processFile(null)
                    }}
                    className='inline-flex w-max items-center gap-1 text-xs text-neutral-600 hover:text-primary-700'
                >
                    <X className='h-3.5 w-3.5' />
                    Remove file
                </button>
            )}

            {error ? <p className='text-xs text-red-500'>{error}</p> : null}
        </div>
    )
}
