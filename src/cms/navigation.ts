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
			name: 'Einstellungen',
			route: '/settings',
		},
		{
			name: 'Userverwaltung',
			route: '/users',
		},
	],
	right: [
		{
			preset: 'userWidget',
			permissions: 'lol',
		},
	],

};

export default nav;
