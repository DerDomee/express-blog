import {Route} from '../../mean/types';
import home from './home';
import catchall from './catchall';
import dynamicImages from '../../mean/routes/dynamicimages';

export default [
	home,
	dynamicImages,
	catchall,
] as Route[];
