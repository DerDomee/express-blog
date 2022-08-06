import options from './options';
import blog from './blog/blog';
import cms from './cms/cms';
import cloudcenter from './cloudcenter/cloudcenter';
import logger from './mean/logger';
import dbInit from './database/dbmanager';

const blogPath = `http://localhost:${options.blogPort}`;
const cmsPath = `http://localhost:${options.cmsPort}`;
const cloudcenterPath = `http://localhost:${options.cloudcenterPort}`;

dbInit(options).then((sequelize) => {
	if (options.blogEnabled) {
		blog.set('sequelizeInstance', sequelize);
		blog.set('blogAbsPath', blogPath);
		blog.set('cmsAbsPath', cmsPath);
		blog.set('cloudcenterAbsPath', cloudcenterPath);
		blog.set('envOptions', options);
		blog.locals.httpInstance = blog.listen(options.blogPort, () => {
			logger.info(`blog | Listening on port ${options.blogPort}`);
		});
	}

	if (options.cmsEnabled) {
		cms.set('sequelizeInstance', sequelize);
		cms.set('blogAbsPath', blogPath);
		cms.set('cmsAbsPath', cmsPath);
		cms.set('cloudcenterAbsPath', cloudcenterPath);
		cms.set('envOptions', options);
		cms.locals.httpInstance = cms.listen(options.cmsPort, () => {
			logger.info(`cms  | Listening on port ${options.cmsPort}`);
		});
	}

	if (options.cloudcenterEnabled) {
		cloudcenter.set('sequelizeInstance', sequelize);
		cloudcenter.set('blogAbsPath', blogPath);
		cloudcenter.set('cmsAbsPath', cmsPath);
		cloudcenter.set('cloudcenterAbsPath', cloudcenterPath);
		cloudcenter.set('envOptions', options);
		cloudcenter.locals.httpInstance = cloudcenter.listen(
			options.cloudcenterPort,
			() => {
				logger.info(`cld  | Listening on port ${options.cloudcenterPort}`);
			},
		);
	}
});
