import {Route} from '../../shared/types';
import home from './home';
import articles from './articles';
import article from './article';
import projects from './projects';
import project from './project';
import aboutme from './aboutme';
import settings from './settings';
import catchall from './catchall';
import login from '../../shared/routes/login';
import logout from '../../shared/routes/logout';
import dynamicImages from '../../shared/routes/dynamicimages';

export default [
	login,
	logout,
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
