import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.midnightexplorer.com'
  const staticRoutes = ['', '/about', '/transactions', '/blocks']

  const dynamicRoutes = async () => {
    // Fetch or generate dynamic routes here
    return []
  }

  // Trả về mảng các URL thay vì object với static/dynamic
  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const dynamicUrls = await dynamicRoutes()

  return [...staticUrls, ...dynamicUrls]
}