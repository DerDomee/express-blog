import {Navigation} from '../mean/types';

const nav: Navigation = {
	left: [
		{
			name: 'Home',
			route: '/',
		},
		{
			name: 'Über mich',
			route: '/aboutme',
		},
		{
			name: 'Blog',
			route: '/articles',
		},
		{
			name: 'Projekte',
			route: '/projects',
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
