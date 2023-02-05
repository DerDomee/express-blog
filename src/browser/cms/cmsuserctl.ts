import {route} from '../shared/commonvars';

const showNewUserModal = () => {
	const newUserModal = document.getElementById(
		'modal-newuser') as HTMLDivElement;
	const abortNewUserBtn = document.getElementById(
		'modal-newuser_abort') as HTMLButtonElement;

	const handleAbort = (ev: MouseEvent) => {
		abortNewUserBtn.removeEventListener('click', handleAbort);
		newUserModal.classList.add('hidden');
	};

	abortNewUserBtn.addEventListener('click', handleAbort);

	newUserModal.classList.remove('hidden');
};

if (route === '/userctl') {
	const newUserBtn = document.querySelector(
		'button[data-user-function="add-new-user"]') as HTMLButtonElement;

	newUserBtn.addEventListener('click', (ev) => {
		showNewUserModal();
	});
}
