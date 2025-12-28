import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  // THAY THẾ 'https://your-domain.com' BẰNG TÊN MIỀN CỦA BẠN
  const sitemapUrl = 'https://www.midnightexplorer.com/sitemap.xml'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // disallow: '/private/', // Ví dụ: chặn một thư mục riêng tư
    },
    sitemap: sitemapUrl,
  }
}