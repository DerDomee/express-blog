import {Route} from '../../mean/types';
import home from './home';
import catchall from './catchall';
import articles from './articles';
import newarticle from './newarticle';
import editarticle from './editarticle';

export default [
	home,
	articles,
	newarticle,
	editarticle,
	catchall,
] as Route[];
