import cluster from 'cluster';
import os from 'os';
import logger from './logger';

if (cluster.isPrimary) {
	const cpuCount = process.env.NODE_ENV==='production' ? Math
		.floor(os.cpus().length/2) : 1;

	for (let i = 0; i < cpuCount; ++i) {
		const spawnedworker = cluster.fork();
		logger.info(`New worker created: ${spawnedworker.id} ` +
		            `(pid: ${spawnedworker.process.pid})`);
	}

	cluster.on('exit', (worker, exitcode, signal) => {
		logger.info(`Worker ${worker.id} died with exit code ${exitcode}` +
		            `${signal ? ` and signal ${signal}` : ''} (pid: ` +
		            `${worker.process.pid})`);

		const newworker = cluster.fork();
		logger.info(`Worker respawned with id ${newworker.id} (pid: ` +
		            `${newworker.process.pid})`);
	});
} else {
	require('./server');
}
