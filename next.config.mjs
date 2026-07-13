/** @type {import('next').NextConfig} */

function getSupabaseRemotePattern() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    if (!supabaseUrl) return null

    try {
        const parsed = new URL(supabaseUrl)
        if (!parsed.hostname) return null

        return {
            protocol: parsed.protocol.replace(':', ''),
            hostname: parsed.hostname,
        }
    } catch {
        return null
    }
}

const supabaseRemotePattern = getSupabaseRemotePattern()

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'i.pravatar.cc',
            },
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
            },
            ...(supabaseRemotePattern ? [supabaseRemotePattern] : []),
        ],
    },
}

export default nextConfig
