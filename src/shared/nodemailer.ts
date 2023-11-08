import nodemailer from 'nodemailer';
import options from '../options';
import logger from './logger';

type SendMailOptions = {
	from?: string;
	to: string;
	subject: string;
	text: string;
	html?: string;
};

export const transporter = nodemailer.createTransport({
	host: options.mailSmtpServer,
	port: options.mailSmtpPort,
	secure: true,
	auth: {
		user: options.mailSmtpUser,
		pass: options.mailSmtpPass,
	},
});

export const sendMail = async ({
	from = options.mailFromField,
	to,
	subject,
	text,
	html,
}: SendMailOptions) => {
	const mail = await transporter.sendMail({
		from,
		to,
		subject,
		text,
		html,
	});

	logger.debug(`Message sent: ${mail.messageId}`);
};
