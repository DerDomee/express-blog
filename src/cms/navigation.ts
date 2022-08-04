import {Navigation} from '../mean/types';

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
	],
	right: [
		{
			preset: 'userWidget',
		},
	],

};

export default nav;
