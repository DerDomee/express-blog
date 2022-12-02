/* eslint-disable node/no-process-env */
import dotenv from 'dotenv';
dotenv.config();

export default {
	nodeEnv: process.env.NODE_ENV,

	blogPort: parseInt(process.env.DD_BLOG_PORT) ?? 3000,
	cmsPort: parseInt(process.env.DD_CMS_PORT) ?? 3001,
	cloudcenterPort: parseInt(process.env.DD_CLOUDCENTER_PORT) ?? 3002,

	blogEnabled: !!process.env.DD_BLOG_ENABLED ?? true,
	cmsEnabled: !!process.env.DD_CMS_ENABLED ?? true,
	cloudcenterEnabled: !!process.env.DD_CLOUDCENTER_ENABLED ?? true, // This comment will restrict the pull request as the linter refuses.

	blogHostname: process.env.DD_BLOG_HOST,
	cmsHostname: process.env.DD_CMS_HOST,
	cloudcenterHostname: process.env.DD_CLOUDCENTER_HOST,

	dbName: process.env.DD_DBNAME,
	dbUser: process.env.DD_DBUSER,
	dbPass: process.env.DD_DBPASS,
	dbHost: process.env.DD_DBHOST,
};
