import {Route} from '../../mean/types';
import home from './home';
import articles from './articles';
import article from './article';
import projects from './projects';
import project from './project';
import aboutme from './aboutme';
import settings from './settings';
import catchall from './catchall';
import login from '../../mean/routes/login';
import logout from '../../mean/routes/logout';
import register from '../../mean/routes/register';
import dynamicImages from '../../mean/routes/dynamicimages';

export default [
	login,
	logout,
	register,
	home,
	articles,
	article,
	projects,
	project,
	aboutme,
	settings,
	dynamicImages,
	catchall,
] as Route[];
