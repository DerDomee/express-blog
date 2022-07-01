import {route} from '../shared/commonvars';

(() => {
	if (!route.startsWith('/tv/')) return;
	const seasonSelector = document.getElementById(
		'seasonSelector') as HTMLSelectElement;

	if (!seasonSelector) return;

	seasonSelector.addEventListener('change', (ev) => {
		console.log(window.location.pathname);
		const target = ev.target as HTMLSelectElement;
		window.location.assign(window.location.pathname + `?s=${target.value}`);
	});
})();
