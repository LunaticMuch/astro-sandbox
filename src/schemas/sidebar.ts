import { z } from 'astro:content';
import type { AstroBuiltinAttributes } from 'astro';
import type { HTMLAttributes } from 'astro/types';

const badgeSchema = () =>
	z.object({
		variant: z.enum(['note', 'danger', 'success', 'caution', 'tip', 'default']).default('default'),
		text: z.string(),
	});

const BadgeConfigSchema = () =>
	z
		.union([z.string(), badgeSchema()])
		.transform((badge) => {
			if (typeof badge === 'string') {
				return { variant: 'default' as const, text: badge };
			}
			return badge;
		})
		.optional();

export type Badge = z.output<ReturnType<typeof badgeSchema>>;

const SidebarBaseSchema = z.object({
	/** The visible label for this item in the sidebar. */
	label: z.string(),
	/** Translations of the `label` for each supported language. */
	translations: z.record(z.string()).default({}),
	/** Adds a badge to the link item */
	badge: BadgeConfigSchema(),
});

const SidebarGroupSchema = SidebarBaseSchema.extend({
	/** Whether this item should be collapsed by default. */
	collapsed: z.boolean().default(false),
});

const linkHTMLAttributesSchema = z.record(
	z.union([z.string(), z.number(), z.boolean(), z.undefined()])
) as z.Schema<Omit<HTMLAttributes<'a'>, keyof AstroBuiltinAttributes | 'children'>>;
export type LinkHTMLAttributes = z.infer<typeof linkHTMLAttributesSchema>;

export const SidebarLinkItemHTMLAttributesSchema = () => linkHTMLAttributesSchema.default({});

const SidebarLinkItemSchema = SidebarBaseSchema.extend({
	/** The link to this item’s content. Can be a relative link to local files or the full URL of an external page. */
	link: z.string(),
	/** HTML attributes to add to the link item. */
	attrs: SidebarLinkItemHTMLAttributesSchema(),
});
export type SidebarLinkItem = z.infer<typeof SidebarLinkItemSchema>;

type ManualSidebarGroupInput = z.input<typeof SidebarGroupSchema> & {
	/** Array of links and subcategories to display in this category. */
	items: Array<
		| z.input<typeof SidebarLinkItemSchema>
		| ManualSidebarGroupInput
	>;
};

type ManualSidebarGroupOutput = z.output<typeof SidebarGroupSchema> & {
	/** Array of links and subcategories to display in this category. */
	items: Array<
		| z.output<typeof SidebarLinkItemSchema>
		| ManualSidebarGroupOutput
	>;
};

const ManualSidebarGroupSchema: z.ZodType<
	ManualSidebarGroupOutput,
	z.ZodTypeDef,
	ManualSidebarGroupInput
> = SidebarGroupSchema.extend({
	/** Array of links and subcategories to display in this category. */
	items: z.lazy(() =>
		z.union([SidebarLinkItemSchema, ManualSidebarGroupSchema]).array()
	),
});

export const SidebarItemSchema = z.union([
	SidebarLinkItemSchema,
	ManualSidebarGroupSchema,
]);
export type SidebarItem = z.infer<typeof SidebarItemSchema>;



