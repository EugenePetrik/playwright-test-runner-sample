import fs from 'fs-extra';
import path from 'path';
import { logger } from '../configs/logger';

// Delete test-results directory
const testResultsDirPath = path.join(__dirname, '..', '..', 'test-results');
logger.info(`Removing the test-results directory -> ${testResultsDirPath}`);
fs.emptyDirSync(testResultsDirPath);
logger.info('Test results directory removed');

// Delete combined.log file
const combinedLogFilePath = path.resolve(__dirname, '..', '..', 'logs', 'combined.log');
logger.info(`Removing the combined.log file -> ${combinedLogFilePath}`);
fs.removeSync(combinedLogFilePath);
logger.info('File combined.log removed');

// Create logs directory
const logsDirPath = path.join(__dirname, '..', '..', 'logs');
logger.info(`Creating the logs directory -> ${logsDirPath}`);
fs.ensureDirSync(logsDirPath);
logger.info('Logs directory created');
