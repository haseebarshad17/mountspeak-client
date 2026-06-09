import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/clsxUtils'

type OnboardStepperProps = {
    activeStep: number
    steps: string[]
}

export function OnboardStepper({ activeStep, steps }: OnboardStepperProps) {
    return (
        <div className='flex w-full justify-center'>
            <div className='flex items-start'>
                {steps.map((step, index) => {
                    const isCompleted = index < activeStep
                    const isActive = index === activeStep

                    return (
                        <div key={step} className='flex items-start'>
                            <div className='flex w-[88px] flex-col items-center gap-2 text-center sm:w-[104px]'>
                                <span
                                    className={cn(
                                        'flex h-8 w-8 items-center justify-center rounded-[9px] border text-sm transition-colors',
                                        isCompleted || isActive
                                            ? 'border-primary-700 bg-primary-700 text-white'
                                            : 'border-neutral-300 bg-white text-neutral-500',
                                    )}
                                >
                                    {isCompleted ? <Check className='h-4 w-4' /> : index + 1}
                                </span>
                                <span
                                    className={cn(
                                        'text-[10px] font-semibold leading-4 xs:text-xs',
                                        isActive || isCompleted ? 'text-neutral-900' : 'text-neutral-500',
                                    )}
                                >
                                    {step}
                                </span>
                            </div>

                            {index < steps.length - 1 && (
                                <div
                                    className={cn(
                                        'mt-4 h-px w-16 sm:w-24 md:w-32',
                                        index < activeStep ? 'bg-primary-700' : 'bg-neutral-300',
                                    )}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
