import { defineCollection, reference, z } from 'astro:content';

const newsletter = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
    })
});

const menu = defineCollection({
    type: 'data',
    schema: z.object({
        name: z.string()
    })
});

export const collections = { newsletter, menu };