/* eslint-disable node/no-process-env */
import dotenv from 'dotenv';
dotenv.config();


/**
 * @param {string} value The string value to convert to a boolean
 * @return {boolean} `undefined` If value is undefined or null
 * @return {boolean} `true` If value is defined and equals 'TRUE' or 'true'
 * @return {boolean} `false` If value is defined and of any other value
 */
const asBool = (value: string): boolean => {
	if (value?.toLowerCase() === 'false') return false;
	if (value?.toLowerCase() !== 'true') return undefined;
	return true;
};

export default {
	nodeEnv: process.env.NODE_ENV,

	blogEnabled: asBool(process.env.DD_SUBAPP_ENABLED_BLOG) ?? true,
	cmsEnabled: asBool(process.env.DD_SUBAPP_ENABLED_CMS) ?? true,
	cloudcenterEnabled: asBool(process.env.DD_SUBAPP_ENABLED_CLOUDCENTER) ?? true,

	blogPort: parseInt(process.env.DD_SUBAPP_PORT_BLOG) ?? 3000,
	cmsPort: parseInt(process.env.DD_SUBAPP_PORT_CMS) ?? 3001,
	cloudcenterPort: parseInt(process.env.DD_SUBAPP_PORT_CLOUDCENTER) ?? 3002,

	blogHostname: process.env.DD_SUBAPP_HOSTNAME_BLOG ?? '',
	cmsHostname: process.env.DD_SUBAPP_HOSTNAME_CMS ?? '',
	cloudcenterHostname: process.env.DD_SUBAPP_HOSTNAME_CLOUDCENTER ?? '',

	dbName: process.env.DD_DBNAME ?? '',
	dbUser: process.env.DD_DBUSER ?? '',
	dbPass: process.env.DD_DBPASS ?? '',
	dbHost: process.env.DD_DBHOST ?? '',

	mailEnabled: asBool(process.env.DD_EMAIL_ENABLED) ?? false,
	mailAdminAddress: process.env.DD_EMAIL_ADMIN_ADDRESS ?? '',
	mailSupportAddress: process.env.DD_EMAIL_SUPPORT_ADDRESS ?? '',
	mailSmtpServer: process.env.DD_EMAIL_SMTP_SERVER ?? '',
	mailSmtpPort: parseInt(process.env.DD_EMAIL_SMTP_PORT) ?? 465,
	mailSmtpUser: process.env.DD_EMAIL_SMTP_USERNAME ?? 'username',
	mailSmtpPass: process.env.DD_EMAIL_SMTP_PASSWORD ?? 'password',
	mailFromField: process.env.DD_EMAIL_FROM ?? 'example@example.com',
};
