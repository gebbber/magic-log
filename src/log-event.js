import timeStamp from './timestamp.js';
import chalk from './chalk.js';

export function logEvent(...args) {
    console.log(chalk.dim(timeStamp('stdout')), ...args);
}

export function logError(...args) {
    console.error(chalk.dim(timeStamp('stderr')), ...args);
}

export default log = { event: logEvent, error: logError };
