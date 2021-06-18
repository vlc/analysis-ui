module.exports = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  productionBrowserSourceMaps: true,
  async headers() {
    return [
      {
        source: '/fonts/inter-var-latin.woff2',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable'
          }
        ]
      },
      {
        source: '/(img|static)/(.*).png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable'
          }
        ]
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/changelog',
        destination: 'https://docs.conveyal.com/changelog',
        permanent: false
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/r5/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
      }
    ]
  }
}
