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
			name: 'Gruppen',
			route: '/groups',
		},
	],
	right: [
		{
			preset: 'userWidget',
		},
	],

};

export default nav;
