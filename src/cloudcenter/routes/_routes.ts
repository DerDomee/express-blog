import {Route} from '../../mean/types';
import home from './home';
import tvShowBrowser from './tvShowBrowser';
import tvShowView from './tvShowView';
import catchall from './catchall';
import dynamicImages from '../../mean/routes/dynamicimages';
import videoViewer from './videoViewer';

export default [
	home,
	tvShowBrowser,
	tvShowView,
	videoViewer,
	dynamicImages,
	catchall,
] as Route[];
