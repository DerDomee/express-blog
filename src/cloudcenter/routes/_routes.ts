import {Route} from '../../shared/types';
import home from './home';
import tvShowBrowser from './tvShowBrowser';
import tvShowView from './tvShowView';
import catchall from './catchall';
import dynamicImages from '../../shared/routes/dynamicimages';
import tvShowVideo from './tvShowVideo';

export default [
	home,
	tvShowBrowser,
	tvShowView,
	tvShowVideo,
	dynamicImages,
	catchall,
] as Route[];
