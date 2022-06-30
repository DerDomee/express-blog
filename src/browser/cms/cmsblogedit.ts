import showdownInstance from '../../mean/showdown';
import {route} from './../shared/commonvars';
const showdownConverter = showdownInstance.makeHtml.bind(showdownInstance);


const inElems = {
	pageTitle: {
		elem: document.getElementById('blogedit-pagetitle') as HTMLInputElement,
		onChange: (ev: Event, key: string) => {
			inElems.htmlTitle.elem.value = inElems.pageTitle.elem.value;
			inElems.urlId.elem.value = inElems.pageTitle.elem.value
				.toLowerCase()
				.replaceAll(/[^a-zA-Z0-9\s]/g, '')
				.replaceAll(/[\s+]/g, '-');

			const event = new Event('change');
			inElems.htmlTitle.elem.dispatchEvent(event);
			inElems.urlId.elem.dispatchEvent(event);
		},
		onInput: (ev: InputEvent, key: string) => {
			outElems.pageTitle.elem.textContent = inElems.pageTitle.elem.value;
		},
		onKeydown: (ev: KeyboardEvent, key: string) => {},
	},
	blurb: {
		elem: document.getElementById('blogedit-blurb') as HTMLInputElement,
		onChange: (ev: Event, key: string) => {},
		onInput: (ev: InputEvent, key: string) => {
			outElems.blurb.elem.textContent = inElems.blurb.elem.value;
		},
		onKeydown: (ev: KeyboardEvent) => {},
	},
	htmlTitle: {
		elem: document.getElementById('blogedit-htmltitle') as HTMLInputElement,
		onChange: (ev: Event, key: string) => {
			document.title = `${inElems.htmlTitle.elem.value} - CMS - Dominik Riedig`;
		},
		onInput: (ev: InputEvent, key: string) => {},
		onKeydown: (ev: KeyboardEvent, key: string) => {},
	},
	urlId: {
		elem: document.getElementById('blogedit-urlid') as HTMLInputElement,
		onChange: (ev: Event, key: string) => {},
		onInput: (ev: InputEvent, key: string) => {},
		onKeydown: (ev: KeyboardEvent, key: string) => {},
	},
	content: {
		elem: document.getElementById('blogedit-content') as HTMLTextAreaElement,
		onChange: (ev: Event, key: string) => {},
		onInput: (ev: InputEvent, key: string) => {
			outElems.content.elem.innerHTML = showdownConverter(
				inElems.content.elem.value);
		},
		onKeydown: (ev: KeyboardEvent, key: string) => {
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
	schedulePublication: {
		elem: document.getElementById(
			'blogedit-schedule-publication') as HTMLInputElement,
		onChange: (ev: Event, key: string) => {
			inElems.publicationTime.elem.parentElement.classList.toggle('hidden');
		},
		onInput: (ev: InputEvent, key: string) => {},
		onKeydown: (ev: KeyboardEvent, key: string) => {},
	},
	publicationTime: {
		elem: document.getElementById(
			'blogedit-publish-time') as HTMLInputElement,
		onChange: (ev: Event, key: string) => {},
		onInput: (ev: InputEvent, key: string) => {},
		onKeydown: (ev: KeyboardEvent, key: string) => {},
	},
	publishUnlisted: {
		elem: document.getElementById(
			'blogedit-publish-unlisted') as HTMLInputElement,
		onChange: (ev: Event, key: string) => {},
		onInput: (ev: InputEvent, key: string) => {},
		onKeydown: (ev: KeyboardEvent, key: string) => {},
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
	submit: {
		elem: document.getElementById('blogedit-submit') as HTMLInputElement,
	},
};


if (route === '/articles/new') {
	for (const [key, value] of Object.entries(inElems)) {
	// When input changes are committed (usually when losing focus after editing)
		value.elem.addEventListener('change',
			(ev: Event) => value.onChange(ev, key));
		// When pressing down a key
		value.elem.addEventListener('keydown',
			(ev: KeyboardEvent) => value.onKeydown(ev, key));
		// After every input directly after changing content
		value.elem.addEventListener('input',
			(ev: InputEvent) => value.onInput(ev, key));
	}

	outElems.content.elem.innerHTML = showdownConverter(
		inElems.content.elem.value);
}
