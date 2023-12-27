import { defineCollection, z } from 'astro:content';
import {SidebarItemSchema } from '../schemas/sidebar'

const tutorialCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
	})
});

// Sidebar schema is complex - it's included in a different file
const sidebarCollection = defineCollection({
	type:'data',
	schema: SidebarItemSchema.array().optional(),
})

export const collections = { 'tutorial': tutorialCollection, 'sidebar': sidebarCollection };