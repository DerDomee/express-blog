import {route} from '../shared/commonvars';

const showNewUserModal = () => {
	const newShowModal = document.getElementById(
		'modal-newtvshow') as HTMLDivElement;
	const abortNewShowBtn = document.getElementById(
		'modal-newtvshow_abort') as HTMLButtonElement;

	const handleAbort = (ev: MouseEvent) => {
		abortNewShowBtn.removeEventListener('click', handleAbort);
		newShowModal.classList.add('hidden');
	};

	abortNewShowBtn.addEventListener('click', handleAbort);

	newShowModal.classList.remove('hidden');
};

if (route === '/tvshows') {
	const newUserBtn = document.querySelector(
		'button[data-tvshow-function="add-new-tvshow"]') as HTMLButtonElement;

	newUserBtn.addEventListener('click', (ev) => {
		showNewUserModal();
	});
}
