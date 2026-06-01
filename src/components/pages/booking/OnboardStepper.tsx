import { Check } from 'lucide-react'
import { cn } from '@/lib/utils/clsxUtils'

type OnboardStepperProps = {
    activeStep: number
    steps: string[]
}

export function OnboardStepper({ activeStep, steps }: OnboardStepperProps) {
    return (
        <div className='mx-auto w-full max-w-[620px]'>
            <div className='grid grid-cols-[minmax(58px,1fr)_minmax(32px,70px)_minmax(58px,1fr)_minmax(32px,70px)_minmax(58px,1fr)] items-start'>
                {steps.map((step, index) => {
                    const isCompleted = index < activeStep
                    const isActive = index === activeStep

                    return (
                        <div key={step} className='contents'>
                            <div className='flex flex-col items-center gap-2 text-center'>
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
                                        'mt-4 h-px w-full',
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
