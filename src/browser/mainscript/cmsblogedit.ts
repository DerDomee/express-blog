import showdownInstance from '../../mean/showdown';
const showdownConverter = showdownInstance.makeHtml.bind(showdownInstance);

const inputContainer = document.getElementById('blogedit-textarea-container');
const previewContainer = document.getElementById('blogedit-preview-container');

inputContainer.addEventListener('input', (ev) => {
	const target = (ev.target as HTMLTextAreaElement);
	previewContainer.innerHTML = showdownConverter(target.value);
});

inputContainer.addEventListener('keydown', (ev) => {
	const target = (ev.target as HTMLTextAreaElement);
	if (ev.key !== 'Tab') return;

	ev.preventDefault();

	target.setRangeText(
		'\t',
		target.selectionStart,
		target.selectionEnd,
		'end',
	);
});

previewContainer.innerHTML = showdownConverter(
	(inputContainer as HTMLTextAreaElement).value,
);
