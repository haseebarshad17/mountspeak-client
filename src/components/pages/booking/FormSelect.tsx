import { cn } from '@/lib/utils/clsxUtils'

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`

type FormSelectProps = {
    label: string
    required?: boolean
    className?: string
    placeholder?: string
    defaultValue?: string
    options: { value: string; label: string }[]
    /** UI-only — dropdown not interactive */
    staticField?: boolean
}

export function FormSelect({
    label,
    required,
    className,
    placeholder = 'Select an option',
    defaultValue = '',
    options,
    staticField = true,
}: FormSelectProps) {
    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label className='block text-sm font-medium text-neutral-700'>
                {label}
                {required && <span className='text-red-400'> *</span>}
            </label>

            <select
                defaultValue={defaultValue}
                disabled={staticField}
                className={cn(
                    'h-11 w-full appearance-none rounded-sm border border-gray-300 bg-neutral-50 bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-3 pr-10 text-sm text-neutral-400 outline-none',
                    staticField && 'cursor-default opacity-100',
                )}
                style={{ backgroundImage: chevronBg }}
            >
                <option value='' disabled>
                    {placeholder}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className='text-neutral-800'>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
