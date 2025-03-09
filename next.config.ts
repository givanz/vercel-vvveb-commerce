module.exports = {
	 env: {
		VVVEB_URL: process.env.VVVEB_URL,
	  },
	images: {
	loader: 'custom',
    loaderFile: './image-loader.js',	  
    //formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        //protocol: 'http',
        hostname: 'demo.vvveb.com',
        //hostname: '**',
      }
    ]
  },
  async redirects() {
    return [
		{
		  source: '/shop',
		  destination: '/search',
		  permanent: true,
		},
	]
  },
}
