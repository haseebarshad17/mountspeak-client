'use client'

export function ContactPageContent() {
    return (
        <section className="pb-20">
            <div className="site-container grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#111]">Get in touch</h2>
                    <p className="mt-2 text-sm text-[#666]">
                        Send your request and our team will contact you shortly.
                    </p>
                    <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <input
                            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                            placeholder="Full name"
                        />
                        <input
                            type="email"
                            className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                            placeholder="Email address"
                        />
                        <textarea
                            className="min-h-[140px] w-full rounded-xl border border-black/10 px-4 py-3 text-sm outline-none"
                            placeholder="Message"
                        />
                        <button
                            type="submit"
                            className="rounded-full bg-[#111] px-6 py-3 text-sm font-medium text-white"
                        >
                            Send message
                        </button>
                    </form>
                </div>
                <div className="rounded-3xl bg-[#06403D] p-8 text-white">
                    <h3 className="text-xl font-semibold">Contact details</h3>
                    <p className="mt-4 text-sm text-white/75">Email: hello@mountspeak.com</p>
                    <p className="mt-2 text-sm text-white/75">Phone: +92 300 000 0000</p>
                    <p className="mt-2 text-sm text-white/75">Address: Islamabad, Pakistan</p>
                </div>
            </div>
        </section>
    )
}
