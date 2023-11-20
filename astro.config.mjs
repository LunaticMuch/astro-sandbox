import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

import { starlightAsides } from './integrations/asides'
import expressiveCode from 'astro-expressive-code';

// https://astro.build/config
export default defineConfig({
	integrations: [preact(), react(), expressiveCode(), mdx(), tailwind()],
	markdown: {
		remarkPlugins: [...starlightAsides()],
	},
});
