import {Route} from '../../shared/types';
import home from './home';
import tvShowBrowser from './tvShowBrowser';
import tvShowEpisodeList from './tvShowEpisodeList';
import tvShowVideo from './tvShowVideo';
import catchall from './catchall';
import dynamicImages from '../../shared/routes/dynamicimages';

export default [
	home,
	tvShowBrowser,
	tvShowEpisodeList,
	tvShowVideo,
	dynamicImages,
	catchall,
] as Route[];
