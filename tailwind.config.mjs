/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}','./integrations/asides.ts'],
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/typography')],
};