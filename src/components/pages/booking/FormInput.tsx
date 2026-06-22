import { cn } from '@/lib/utils/clsxUtils'
import React from 'react'

type BaseProps = {
    label: string
    required?: boolean
    className?: string
    classNames?: { label?: string; input?: string; required?: string }
    placeholder?: string
    error?: string
    textarea?: boolean
    /** UI-only fields — no user input */
    staticField?: boolean
}

type FormInputProps = BaseProps &
    (
        | (Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> & { textarea?: false })
        | (Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & { textarea: true })
    )

export function FormInput({
    label,
    required,
    className,
    classNames,
    placeholder,
    error,
    textarea,
    staticField = true,
    ...props
}: FormInputProps) {
    const invalid = !!error
    const fieldClassName = cn(
        'w-full rounded-sm border border-gray-300 bg-neutral-50 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600',
        invalid && 'border-red-400 focus:border-red-500 focus:ring-0',
        textarea ? 'h-auto min-h-[96px] resize-none p-3 sm:min-h-[120px]' : 'h-10 px-3 sm:h-11',
        classNames?.input,
    )

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label
                className={cn(
                    'block text-sm font-medium text-neutral-700',
                    !label && 'hidden',
                    classNames?.label,
                )}
            >
                {label}
                {required && <span className={cn('text-red-400', classNames?.required)}> *</span>}
            </label>

            {textarea ? (
                <textarea
                    placeholder={placeholder}
                    aria-invalid={invalid || undefined}
                    readOnly={staticField}
                    tabIndex={staticField ? -1 : undefined}
                    className={cn(fieldClassName, staticField && 'cursor-default')}
                    {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                />
            ) : (
                <input
                    placeholder={placeholder}
                    aria-invalid={invalid || undefined}
                    readOnly={staticField}
                    tabIndex={staticField ? -1 : undefined}
                    className={cn(fieldClassName, staticField && 'cursor-default')}
                    {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
                />
            )}

            {error ? <p className='text-xs text-red-500'>{error}</p> : null}
        </div>
    )
}
