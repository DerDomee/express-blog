import winston from 'winston';
import options from '../options';

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json(),
	),
	transports: [
		new winston.transports.File({
			filename: 'logs/error.log',
			level: 'error',
		}),
		new winston.transports.File({
			filename: 'logs/combined.log',
			level: 'verbose',
		}),
	],
});

if (options.nodeEnv === 'production') {
	logger.add(new winston.transports.Console({
		format: winston.format.cli(),
		level: 'info',
	}));
} else if (options.nodeEnv === 'development') {
	logger.add(new winston.transports.Console({
		format: winston.format.cli(),
		level: 'debug',
	}));
}

export default logger;
