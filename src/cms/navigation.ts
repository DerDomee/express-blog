import {Navigation} from '../shared/types';

const nav: Navigation = {
	left: [
		{
			name: 'Dashboard',
			route: '/',
		},
		{
			name: 'Blogartikel',
			route: '/articles',
		},
		{
			name: 'Nutzer',
			route: '/userctl',
		},
		{
			name: 'Bilder',
			route: '/imagectl',
		},
		{
			name: 'TV Shows',
			route: '/tvshows',
		},
	],
	right: [
		{
			preset: 'userWidget',
		},
	],

};

export default nav;
