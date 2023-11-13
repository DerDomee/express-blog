import {route} from '../shared/commonvars';

const showNewTvShowModal = () => {
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
	const newTvShowBtn = document.querySelector(
		'button[data-tvshow-function="add-new-tvshow"]') as HTMLButtonElement;

	newTvShowBtn.addEventListener('click', (ev) => {
		showNewTvShowModal();
	});
}

const showNewSeasonModal = () => {
	const newSeasonModal = document.getElementById(
		'modal-newtvseason') as HTMLDivElement;
	const abortNewSeasonBtn = document.getElementById(
		'modal-newtvseason_abort') as HTMLButtonElement;

	const handleAbort = (ev: MouseEvent) => {
		abortNewSeasonBtn.removeEventListener('click', handleAbort);
		newSeasonModal.classList.add('hidden');
	};

	abortNewSeasonBtn.addEventListener('click', handleAbort);

	newSeasonModal.classList.remove('hidden');
};

// Match `/tvshows/:tvShowId`, where `:tvShowId` is a UUIDv4
if (route.match(/^\/tvshows\/[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}$/)) {
	const newSeasonBtn = document.querySelector(
		'button[data-tvshow-function="add-new-season"]') as HTMLButtonElement;

	newSeasonBtn.addEventListener('click', (ev) => {
		showNewSeasonModal();
	});
}
