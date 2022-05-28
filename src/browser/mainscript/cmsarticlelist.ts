import {route} from './commonvars';

interface ModalElements {
	actionModal: HTMLElement,
	actionModalTitle: HTMLElement,
	actionModalDesc: HTMLElement,
	actionModalYesBtn: HTMLElement,
	actionModalNoBtn: HTMLElement,
}

const postToPage = (path: string, params: object, method='post'): void => {
	const form = document.createElement('form');
	form.method = method;
	form.action = path;

	for (const [key, value] of Object.entries(params)) {
		if (!value) continue;
		const hiddenField = document.createElement('input');
		hiddenField.type = 'hidden';
		hiddenField.name = key;
		hiddenField.value = value;

		form.appendChild(hiddenField);
	}
	document.body.appendChild(form);
	form.submit();
};

const showModal = (
	modalElements: ModalElements,
	modalTitle: string,
	modalDescription: string,
	callback: (ev: MouseEvent) => void,
) => {
	modalElements.actionModalTitle.textContent = modalTitle;
	modalElements.actionModalDesc.textContent = modalDescription;
	const showModal = () => {
		modalElements.actionModal.classList.remove('hidden');
	};
	const hideModal = () => {
		modalElements.actionModal.classList.add('hidden');
	};
	const noEvent = (ev: MouseEvent) => {
		ev.target.removeEventListener('click', noEvent);
		hideModal();
	};
	const yesEvent = (ev: MouseEvent) => {
		ev.target.removeEventListener('click', yesEvent);
		hideModal();
		callback(ev);
	};
	modalElements.actionModalYesBtn.addEventListener('click', yesEvent);
	modalElements.actionModalNoBtn.addEventListener('click', noEvent);
	showModal();
};

if (route === '/articles') {
	const modalObject: ModalElements = {
		actionModal: document.getElementById('modal-yesno'),
		actionModalTitle: document.getElementById('modal-yesno_title'),
		actionModalDesc: document.getElementById('modal-yesno_description'),
		actionModalYesBtn: document.getElementById('modal-yesno_yes'),
		actionModalNoBtn: document.getElementById('modal-yesno_no'),
	};

	[...document.querySelectorAll('button[data-blog-function]')].forEach(
		(elem: HTMLElement) => {
			elem.addEventListener('click', (ev) => {
				const blogid = parseInt(elem.dataset.blogId);
				if (blogid === NaN) return;
				switch (elem.dataset.blogFunction) {
				case 'publish':
					showModal(
						modalObject,
						'Blog veröffentlichen',
						`Möchtest du Blog ${blogid} wirklich veröffentlichen?`,
						(ev) => {
							postToPage('', {
								blogMethod: 'publish',
								blogId: blogid,
							});
						},
					);
					break;
				case 'unpublish':
					showModal(
						modalObject,
						'Blog auf ungelistet stellen',
						`Möchtest du Blog ${blogid} wirklich verstecken?`,
						(ev) => {
							postToPage('', {
								blogMethod: 'unpublish',
								blogId: blogid,
							});
						},
					);
					break;
				case 'edit':
					showModal(
						modalObject,
						'Blog editieren',
						`Möchtest du Blog ${blogid} wirklich editieren?`,
						(ev) => {
							document.location = `/articles/edit/${blogid}`;
						},
					);
					break;
				default:
					break;
				}
			});
		},
	);
}
