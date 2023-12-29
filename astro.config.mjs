import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import remarkDirective from 'remark-directive'
// import myRemarkPlugin from './integrations/remark-directive-demo'
import rehypeFormat from 'rehype-format'
import rehypeStringify from 'rehype-stringify'

// import { starlightAsides } from './integrations/asides'
import expressiveCode from 'astro-expressive-code';
import {admonitions} from './integrations/admonitions'

// export default admonitions

// https://astro.build/config
export default defineConfig({
	integrations: [preact(), react(), expressiveCode(), mdx(), tailwind()],
	markdown: {
		remarkPlugins: [remarkDirective,admonitions],
		rehypePlugins: [rehypeFormat, rehypeStringify]
	}
});
