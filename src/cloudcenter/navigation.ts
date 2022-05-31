import {Navigation} from '../mean/types';

const nav: Navigation = {
	left: [
		{
			name: 'Startseite',
			route: '/',
		},
		{
			name: 'Serien',
			route: '/tv',
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
