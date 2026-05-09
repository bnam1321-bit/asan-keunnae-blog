/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://cheongnanum.co.kr',
  generateRobotsTxt: true,
  sitemapSize: 7000,
}
