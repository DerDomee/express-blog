import showdownInstance from '../../mean/showdown.ts';
const showdownConverter = showdownInstance.makeHtml.bind(showdownInstance);

const inputContainer = document.getElementById('blogedit-textarea-container');
const previewContainer = document.getElementById('blogedit-preview-container');

inputContainer.addEventListener('input', (ev) => {
	previewContainer.innerHTML = showdownConverter(ev.target.value);
});

inputContainer.addEventListener('keydown', (ev) => {
	if (ev.key !== 'Tab') return;

	ev.preventDefault();

	ev.target.setRangeText(
		'\t',
		ev.target.selectionStart,
		ev.target.selectionEnd,
		'end',
	);
});

previewContainer.innerHTML = showdownConverter(inputContainer.value);
