/* eslint-disable node/no-process-env */
import dotenv from 'dotenv';
dotenv.config();

export default {
	nodeEnv: process.env.NODE_ENV,

	blogEnabled: process.env.DD_SUBAPP_ENABLED_BLOG ?? true,
	cmsEnabled: process.env.DD_SUBAPP_ENABLED_CMS ?? true,
	cloudcenterEnabled: process.env.DD_SUBAPP_ENABLED_CLOUDCENTER ?? true,

	blogPort: parseInt(process.env.DD_SUBAPP_PORT_BLOG) ?? 3000,
	cmsPort: parseInt(process.env.DD_SUBAPP_PORT_CMS) ?? 3001,
	cloudcenterPort: parseInt(process.env.DD_SUBAPP_PORTCLOUDCENTER) ?? 3002,


	blogHostname: process.env.DD_SUBAPP_HOSTNAME_BLOG,
	cmsHostname: process.env.DD_SUBAPP_HOSTNAME_CMS,
	cloudcenterHostname: process.env.DD_SUBAPP_HOSTNAME_CLOUDCENTER,

	dbName: process.env.DD_DBNAME,
	dbUser: process.env.DD_DBUSER,
	dbPass: process.env.DD_DBPASS,
	dbHost: process.env.DD_DBHOST,
};
