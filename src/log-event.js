import timeStamp from './timestamp.js';
import chalk from './chalk.js';

export default function logEvent(...args) {
    console.log(chalk.dim(timeStamp()), ...args);
}

export function logError(...args) {
    console.error(chalk.dim(timeStamp()), ...args);
}
