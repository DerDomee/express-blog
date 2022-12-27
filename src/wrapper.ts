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
		blog.app.set('sequelizeInstance', sequelize);
		blog.app.set('blogAbsPath', blogPath);
		blog.app.set('cmsAbsPath', cmsPath);
		blog.app.set('cloudcenterAbsPath', cloudcenterPath);
		blog.app.set('envOptions', options);
		blog.app.locals.httpInstance = blog.server.listen(options.blogPort, () => {
			logger.info(`blog | Listening on port ${options.blogPort}`);
		});
	}

	if (options.cmsEnabled) {
		cms.app.set('sequelizeInstance', sequelize);
		cms.app.set('blogAbsPath', blogPath);
		cms.app.set('cmsAbsPath', cmsPath);
		cms.app.set('cloudcenterAbsPath', cloudcenterPath);
		cms.app.set('envOptions', options);
		cms.app.locals.httpInstance = cms.server.listen(options.cmsPort, () => {
			logger.info(`cms  | Listening on port ${options.cmsPort}`);
		});
	}

	if (options.cloudcenterEnabled) {
		cloudcenter.app.set('sequelizeInstance', sequelize);
		cloudcenter.app.set('blogAbsPath', blogPath);
		cloudcenter.app.set('cmsAbsPath', cmsPath);
		cloudcenter.app.set('cloudcenterAbsPath', cloudcenterPath);
		cloudcenter.app.set('envOptions', options);
		cloudcenter.app.locals.httpInstance = cloudcenter.server.listen(
			options.cloudcenterPort,
			() => {
				logger.info(`cld  | Listening on port ${options.cloudcenterPort}`);
			},
		);
	}
});
