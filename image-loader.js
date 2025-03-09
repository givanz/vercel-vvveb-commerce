'use client'
 
export default function imageLoader({ src, width, quality }) {
	if (src.indexOf("image-cache") == -1) {
		src = "media/" + src;
	}
	
	return `${process.env.VVVEB_URL}/${src}`
}
