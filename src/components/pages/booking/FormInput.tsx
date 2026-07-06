import { cn } from '@/lib/utils/clsxUtils'
import React from 'react'

import {
    bookingFieldInputClassName,
    bookingFieldLabelClassName,
    bookingFieldTextareaClassName,
} from './booking-form-ui'

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
        textarea ? bookingFieldTextareaClassName : bookingFieldInputClassName,
        invalid && 'border-red-400 focus:ring-red-200',
        classNames?.input,
    )

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label
                className={cn(
                    bookingFieldLabelClassName,
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
