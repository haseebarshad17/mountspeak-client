'use client'

import { FileImage, Upload, X } from 'lucide-react'
import { useId, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

export function FileUploadField({
    label,
    file,
    onChange,
    error,
    accept = 'image/*',
    hint = 'PNG, JPG up to 10MB',
    labelClassName,
}: {
    label: string
    file: File | null
    onChange: (file: File | null) => void
    error?: string
    accept?: string
    hint?: string
    labelClassName?: string
}) {
    const inputId = useId()
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="min-w-0">
            <span
                className={cn(
                    'mb-2 block text-xs font-medium uppercase tracking-wide text-[#888]',
                    labelClassName
                )}
            >
                {label}
            </span>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={accept}
                className="sr-only"
                onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            />

            {file ? (
                <div
                    className={cn(
                        'flex items-center gap-3 rounded-xl bg-white px-3.5 py-3 ring-1 ring-[#EBE8E3]',
                        error && 'ring-red-400'
                    )}
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F3EDE3] text-[#8B6B3D]">
                        <FileImage className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[#111]">
                            {file.name}
                        </p>
                        <p className="text-xs text-[#888]">
                            {(file.size / 1024).toFixed(0)} KB
                        </p>
                    </div>
                    <button
                        type="button"
                        aria-label="Remove file"
                        onClick={() => {
                            onChange(null)
                            if (inputRef.current) inputRef.current.value = ''
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[#666] transition hover:bg-[#F7F3EE] hover:text-[#111]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={cn(
                        'flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-[#FAFAF8] px-4 py-6 text-center ring-1 ring-[#EBE8E3] transition hover:bg-white hover:ring-brand/20',
                        error && 'ring-red-400'
                    )}
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Upload className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-[#111] sm:text-base">
                        Choose file
                    </span>
                    <span className="text-xs text-[#6B7280] sm:text-sm">{hint}</span>
                </button>
            )}

            {error ? <p className="mt-1.5 text-sm text-red-600">{error}</p> : null}
        </div>
    )
}
