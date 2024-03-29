import showdown from 'showdown';
import hljs from 'highlight.js';

export default new showdown.Converter({
	headerLevelStart: 2,
	ghCompatibleHeaderId: true,
	strikethrough: true,
	tables: true,
	tasklists: true,
	requireSpaceBeforeHeadingText: true,
	splitAdjacentBlockquotes: true,
	disableForced4SpacesIndentedSublists: true,
	extensions: [
		{
			// This wraps an overflow container around tables
			// to allow for scrolling on small screens
			type: 'output',
			regex: /<table>(.*\n)*<\/table>/gm,
			replace: (text: string, _converter: string, _options: string) => {
				return `<div class="overflow-x-auto">${text}</div>`;
			},
		},
		{
			// This uses highlight.js for codeblocks
			type: 'output',
			filter: (text, converter, options) => {
				const left = '<pre><code\\b[^>]*>';
				const right = '</code></pre>';
				const flags = 'g';
				const repl = (
					_wholeMatch: string, match: string, left: string, right: string) => {
					match = match
						.replace(/&amp;/g, '&')
						.replace(/&lt;/g, '<')
						.replace(/&gt;/g, '>');

					const lang = left.replace(
						/<pre><code\s*class="([\w-]+) ([\w-]+)">/g,
						'$1',
					);

					if (lang && lang !== '<pre><code>') {
						match = hljs.highlight(match, {
							language: lang,
							ignoreIllegals: true,
						}).value;
					}
					return left + match + right;
				};
				return showdown.helper.replaceRecursiveRegExp(
					text,
					repl,
					left,
					right,
					flags,
				);
			},
		},
	],
});
