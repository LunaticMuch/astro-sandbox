/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}','./integrations/asides.ts','./integrations/remark-directive-demo.ts', './astro.config.mjs'],
	theme: {
		extend: {},
	},
	plugins: [require('@tailwindcss/typography')],
};
