import { LoginPageContent } from '@/components/auth/LoginPageContent'
import { loadAgencyContext } from '@/lib/site/load-agency-context'

function isLocalHost(host: string) {
    return host.startsWith('localhost') || host.startsWith('127.0.0.1')
}

export default async function LoginPage() {
    const { homepage, host } = await loadAgencyContext()
    const previewHost = isLocalHost(host) ? null : host

    return (
        <LoginPageContent
            page={homepage.page}
            agencyId={homepage.agencyId}
            siteUrl={homepage.siteUrl || (previewHost ? `https://${previewHost}` : null)}
            previewHost={previewHost}
        />
    )
}
