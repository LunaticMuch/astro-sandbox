import type { AstroUserConfig } from 'astro';
import { h as _h, s as _s, type Properties } from 'hastscript';
import type { Paragraph as P, Text as T, Root } from 'mdast';
import remarkDirective from 'remark-directive';
import type { Plugin, Transformer } from 'unified';
import { remove } from 'unist-util-remove';
import { visit } from 'unist-util-visit';

// New imports
import { iconPaths } from './asides-icons';

/** Hacky function that generates an mdast HTML tree ready for conversion to HTML by rehype. */
function h(el: string, attrs: Properties = {}, children: any[] = []): P {
	const { tagName, properties } = _h(el, attrs);
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties },
		children,
	};
}

/** Hacky function that generates an mdast SVG tree ready for conversion to HTML by rehype. */
function s(el: string, attrs: Properties = {}, children: any[] = []): P {
	const { tagName, properties } = _s(el, attrs);
	return {
		type: 'paragraph',
		data: { hName: tagName, hProperties: properties },
		children,
	};
}

/**
 * remark plugin that converts blocks delimited with `:::` into styled
 * asides (a.k.a. “callouts”, “admonitions”, etc.). Depends on the
 * `remark-directive` module for the core parsing logic.
 *
 * For example, this Markdown
 *
 * ```md
 * :::tip[Did you know?]
 * Astro helps you build faster websites with “Islands Architecture”.
 * :::
 * ```
 *
 * will produce this output
 *
 * ```astro
 * <aside class="starlight-aside starlight-aside--tip" aria-label="Did you know?">
 *   <p class="starlight-aside__title" aria-hidden="true">Did you know?</p>
 *   <section class="starlight-aside__content">
 *     <p>Astro helps you build faster websites with “Islands Architecture”.</p>
 *   </section>
 * </Aside>
 * ```
 */
function remarkAsides(): Plugin<[], Root> {
	type Variant = 'note' | 'tip' | 'caution' | 'danger';
	const variants = new Set(['note', 'tip', 'caution', 'danger']);
	const isAsideVariant = (s: string): s is Variant => variants.has(s);

	// TODO: hook these up for i18n once the design for translating strings is ready
	const defaultTitles = {
		note: 'Note',
		tip: 'Tip',
		caution: 'Caution',
		danger: 'Danger',
	};



	const transformer: Transformer<Root> = (tree) => {
		visit(tree, (node, index, parent) => {
			if (!parent || index === null || node.type !== 'containerDirective') {
				return;
			}
			const variant = node.name;
			if (!isAsideVariant(variant)) return;

			let title = defaultTitles[variant];
			remove(node, (child): boolean | void => {
				if (child.data?.directiveLabel) {
					if (
						'children' in child &&
						Array.isArray(child.children) &&
						'value' in child.children[0]
					) {
						title = child.children[0].value;
					}
					return true;
				}
			});

			const aside = h(
				'aside',
				{
					'aria-label': title,
					class: `flex not-prose flex-1`,
				},
				[
					h('div', { class: 'w-1.5 bg-purple-700' }),
					h('div', { class: 'bg-purple-200 px-2 py-1 text-purple-900', 'aria-hidden': 'true' }, [

						s(
							'svg',
							{
								viewBox: '0 0 24 24',
								width: 16,
								height: 16,
								fill: 'currentColor',
								class: 'inline-block',
							},
							iconPaths[variant]
						),
						h('span', { class: 'font-bold tracking-widest pl-2' }, [{ type: 'text', value: title }]),
						h('div', { class: 'font-normal prose prose-a:text-white' }, node.children),

					]),

				]
			);

			parent.children[index] = aside;
		});
	};

	return function attacher() {
		return transformer;
	};
}

type RemarkPlugins = NonNullable<NonNullable<AstroUserConfig['markdown']>['remarkPlugins']>;

export function starlightAsides(): RemarkPlugins {
	return [remarkDirective, remarkAsides()];
}
