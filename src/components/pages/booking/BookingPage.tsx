'use client'

/** Booking UI is static: step navigation only — no form validation or API submission. */

import { useState } from 'react'
import { BookingHeaderSection } from './BookingHeaderSection'
import { OnboardIntro } from './OnboardIntro'
import { OnboardStepper } from './OnboardStepper'
import { bookingStepsContent } from './content'
import { FinalizeStep } from './steps/FinalizeStep'
import { IdentityStep } from './steps/IdentityStep'
import { ProfessionalStep } from './steps/ProfessionalStep'

const onboardSteps = ['Identity', 'Professional', 'Finalize'] as const

export default function BookingPage() {
    const [activeStep, setActiveStep] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)

    const currentContent = bookingStepsContent[activeStep]

    const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0))

    if (isSuccess) {
        return (
            <>
                <BookingHeaderSection />
                <div className='agency-container py-20 text-center'>
                    <h2
                        className='text-3xl font-semibold text-neutral-800'
                        style={{ fontFamily: 'var(--font-booking-heading), ui-sans-serif' }}
                    >
                        Application Submitted
                    </h2>
                    <p className='mx-auto mt-4 max-w-md text-base text-neutral-600'>
                        Thank you for applying. Our team will review your details and contact you shortly.
                    </p>
                    <button
                        type='button'
                        onClick={() => {
                            setIsSuccess(false)
                            setActiveStep(0)
                        }}
                        className='mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary-700 px-10 text-base text-white hover:bg-primary-800'
                    >
                        Start New Application
                    </button>
                </div>
            </>
        )
    }

    return (
        <>
            <BookingHeaderSection />

            <div className='agency-container pb-16 pt-10 xs:pt-12 sm:pb-20 sm:pt-14 md:pt-16 lg:pb-24 xl:pt-20'>
                <OnboardStepper activeStep={activeStep} steps={[...onboardSteps]} />

                <div
                    className='mt-10 grid items-start gap-10 xs:mt-12 sm:mt-14 xl:mt-16 xl:grid-cols-[minmax(0,455px)_minmax(0,555px)] xl:justify-center xl:gap-16 2xl:gap-24'
                >
                    <OnboardIntro {...currentContent} />

                    <div className='mx-auto w-full max-w-[555px] rounded-[10px] border border-neutral-300 bg-white px-4 py-6 xs:px-5 sm:px-9 sm:py-9 xl:mx-0'>
                        {activeStep === 0 && (
                            <IdentityStep onContinue={() => setActiveStep(1)} />
                        )}
                        {activeStep === 1 && (
                            <ProfessionalStep
                                onContinue={() => setActiveStep(2)}
                                onBack={handleBack}
                            />
                        )}
                        {activeStep === 2 && (
                            <FinalizeStep
                                onBack={handleBack}
                                onSubmit={() => setIsSuccess(true)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
