import dotenv from 'dotenv';
import blog from './blog/blog';
import cms from './cms/cms';
import logger from './logger';
import dbInit, {allowedEnvs} from './database/dbmanager';

dotenv.config();

const blogport = process.env.DD_BLOG_PORT ?? 3000;
const cmsport = process.env.DD_CMS_PORT ?? 3001;

dbInit(process.env.NODE_ENV as allowedEnvs).then((sequelize) => {
	blog.set('sequelizeInstance', sequelize);
	// Start listening with this instance on specified port (cluster worker mode)
	blog.locals.httpInstance = blog.listen(blogport, () => {
		logger.info(`blog | Listening on port ${blogport}`);
	});

	cms.set('sequelizeInstance', sequelize);

	cms.locals.httpInstance = cms.listen(cmsport, () => {
		logger.info(`cms  | Listening on port ${cmsport}`);
	});
});
