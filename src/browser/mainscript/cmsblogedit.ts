import showdownInstance from '../../mean/showdown';
const showdownConverter = showdownInstance.makeHtml.bind(showdownInstance);

const inElems = {
	pageTitle: {
		elem: document.getElementById('blogedit-pagetitle') as HTMLInputElement,
		onChange: (ev: Event) => {
			inElems.htmlTitle.elem.value = inElems.pageTitle.elem.value;
			inElems.urlId.elem.value = inElems.pageTitle.elem.value
				.toLowerCase()
				.replaceAll(/[^a-zA-Z0-9\s]/g, '')
				.replaceAll(/[\s+]/g, '-');
		},
		onInput: (ev: InputEvent) => {
			outElems.pageTitle.elem.textContent = inElems.pageTitle.elem.value;
		},
		onKeydown: (ev: KeyboardEvent) => {},
	},
	blurb: {
		elem: document.getElementById('blogedit-blurb') as HTMLInputElement,
		onChange: (ev: Event) => {},
		onInput: (ev: InputEvent) => {
			outElems.blurb.elem.textContent = inElems.blurb.elem.value;
		},
		onKeydown: (ev: KeyboardEvent) => {},
	},
	htmlTitle: {
		elem: document.getElementById('blogedit-htmltitle') as HTMLInputElement,
		onChange: (ev: Event) => {},
		onInput: (ev: InputEvent) => {},
		onKeydown: (ev: KeyboardEvent) => {},
	},
	urlId: {
		elem: document.getElementById('blogedit-urlid') as HTMLInputElement,
		onChange: (ev: Event) => {},
		onInput: (ev: InputEvent) => {},
		onKeydown: (ev: KeyboardEvent) => {},
	},
	content: {
		elem: document.getElementById('blogedit-content') as HTMLTextAreaElement,
		onChange: (ev: Event) => {},
		onInput: (ev: InputEvent) => {
			outElems.content.elem.innerHTML = showdownConverter(
				inElems.content.elem.value);
		},
		onKeydown: (ev: KeyboardEvent) => {
			if (ev.key !== 'Tab') return;

			ev.preventDefault();

			inElems.content.elem.setRangeText(
				'\t',
				inElems.content.elem.selectionStart,
				inElems.content.elem.selectionEnd,
				'end',
			);
		},
	},
};

const outElems = {
	pageTitle: {
		elem: document.getElementById('blogpreview-title') as HTMLHeadingElement,
	},
	blurb: {
		elem: document.getElementById('blogpreview-blurb') as HTMLParagraphElement,
	},
	content: {
		elem: document.getElementById('blogpreview-content') as HTMLDivElement,
	},
};

for (const [key, value] of Object.entries(inElems)) {
	console.log(key, value);
	// When input changes are committed (usually when losing focus after editing)
	value.elem.addEventListener('change', value.onChange);
	// When pressing down a key
	value.elem.addEventListener('keydown', value.onKeydown);
	// After every input directly after changing content
	value.elem.addEventListener('input', value.onInput);
}

outElems.content.elem.innerHTML = showdownConverter(inElems.content.elem.value);
