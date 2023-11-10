import {Route} from '../../shared/types';
import home from './home';
import catchall from './catchall';
import articles from './articles';
import newarticle from './newarticle';
import editarticle from './editarticle';
import dynamicImages from '../../shared/routes/dynamicimages';
import imageCtl from './imagectl';
import userCtl from './userctl';
import perms from './perms';
import tvshows from './tvshows';

export default [
	home,
	articles,
	newarticle,
	editarticle,
	userCtl,
	imageCtl,
	dynamicImages,
	perms,
	tvshows,
	catchall,
] as Route[];
