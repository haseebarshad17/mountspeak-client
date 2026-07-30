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
}: {
    label: string
    file: File | null
    onChange: (file: File | null) => void
    error?: string
    accept?: string
    hint?: string
}) {
    const inputId = useId()
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="min-w-0">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#888]">
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
                        'flex items-center gap-3 rounded-xl border border-black/10 bg-white px-3.5 py-3',
                        error && 'border-red-400'
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
                        'flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/15 bg-white px-4 py-5 text-center transition hover:border-[#111]/30 hover:bg-[#FAF7F2]',
                        error && 'border-red-400'
                    )}
                >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EDE3] text-[#8B6B3D]">
                        <Upload className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-medium text-[#111]">
                        Choose file
                    </span>
                    <span className="text-xs text-[#888]">{hint}</span>
                </button>
            )}

            {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
        </div>
    )
}
