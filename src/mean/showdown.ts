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
			replace: (text: any, _converter: any, _options: any) => {
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
				const repl = (_wholeMatch: any, match: any, left: any, right: any) => {
					match = match
						.replace(/&amp;/g, '&')
						.replace(/&lt;/g, '<')
						.replace(/&gt;/g, '>');
					return left + hljs.highlightAuto(match).value + right;
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
