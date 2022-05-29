import dotenv from 'dotenv';
import blog from './blog/blog';
import cms from './cms/cms';
import cloudcenter from './cloudcenter/cloudcenter';
import logger from './mean/logger';
import dbInit, {allowedEnvs} from './database/dbmanager';

dotenv.config();

const blogPort = process.env.DD_BLOG_PORT ?? 3000;
const cmsPort = process.env.DD_CMS_PORT ?? 3001;
const cloudcenterPort = process.env.DD_CLOUDCENTER_PORT ?? 3002;

const blogEnabled = process.env.DD_BLOG_ENABLED ?? true;
const cmsEnabled = process.env.DD_CMS_ENABLED ?? true;
const cloudcenterEnabled = process.env.DD_CLOUDCENTER_ENABLED ?? true;

const blogPath = `http://localhost:${blogPort}`;
const cmsPath = `http://localhost:${cmsPort}`;
const cloudcenterPath = `http://localhost:${cloudcenterPort}`;

dbInit(process.env.NODE_ENV as allowedEnvs).then((sequelize) => {
	if (blogEnabled) {
		blog.set('sequelizeInstance', sequelize);
		blog.set('blogAbsPath', blogPath);
		blog.set('cmsAbsPath', cmsPath);
		blog.set('cloudcenterAbsPath', cloudcenterPath);
		blog.locals.httpInstance = blog.listen(blogPort, () => {
			logger.info(`blog | Listening on port ${blogPort}`);
		});
	}

	if (cmsEnabled) {
		cms.set('sequelizeInstance', sequelize);
		cms.set('blogAbsPath', blogPath);
		cms.set('cmsAbsPath', cmsPath);
		cms.set('cloudcenterAbsPath', cloudcenterPath);
		cms.locals.httpInstance = cms.listen(cmsPort, () => {
			logger.info(`cms  | Listening on port ${cmsPort}`);
		});
	}

	if (cloudcenterEnabled) {
		cloudcenter.set('sequelizeInstance', sequelize);
		cloudcenter.set('blogAbsPath', blogPath);
		cloudcenter.set('cmsAbsPath', cmsPath);
		cloudcenter.set('cloudcenterAbsPath', cloudcenterPath);
		cloudcenter.locals.httpInstance = cloudcenter.listen(
			cloudcenterPort,
			() => {
				logger.info(`cld  | Listening on port ${cloudcenterPort}`);
			},
		);
	}
});
