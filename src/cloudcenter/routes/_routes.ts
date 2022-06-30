import {Route} from '../../mean/types';
import home from './home';
import tvShowBrowser from './tvShowBrowser';
import tvShowView from './tvShowView';
import catchall from './catchall';
import dynamicImages from '../../mean/routes/dynamicimages';

export default [
	home,
	tvShowBrowser,
	tvShowView,
	dynamicImages,
	catchall,
] as Route[];
