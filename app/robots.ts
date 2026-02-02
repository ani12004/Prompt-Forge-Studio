import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/dashboard/', '/studio/', '/admin/', '/settings/', '/profile/'],
        },
        sitemap: 'https://prompt-forge-studio.vercel.app/sitemap.xml',
    }
}
