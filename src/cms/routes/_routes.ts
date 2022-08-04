import {Route} from '../../mean/types';
import home from './home';
import catchall from './catchall';
import articles from './articles';
import newarticle from './newarticle';
import editarticle from './editarticle';
import dynamicImages from '../../mean/routes/dynamicimages';
import userCtl from './userctl';

export default [
	home,
	articles,
	newarticle,
	editarticle,
	userCtl,
	dynamicImages,
	catchall,
] as Route[];
