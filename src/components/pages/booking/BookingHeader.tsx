import Image from 'next/image'
import Link from 'next/link'

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Discover', href: '/discover' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact', href: '/contact-us' },
] as const

export function BookingHeader() {
    return (
        <header className='relative z-10 border-b border-white/30 bg-transparent'>
            <div className='agency-container flex h-[118px] items-center justify-between gap-6'>
                <Link href='/' className='flex shrink-0 items-center gap-3'>
                    <Image
                        src='/images/generic/agency-logo.svg'
                        alt='Pakistan Travel'
                        width={56}
                        height={56}
                        className='h-11 w-auto sm:h-11'
                        priority
                    />
                </Link>

                <nav className='hidden items-center gap-6 lg:flex xl:gap-8' aria-label='Main navigation'>
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className='text-sm font-normal text-neutral-800 transition-colors hover:text-primary-700 xl:text-base'
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    )
}
