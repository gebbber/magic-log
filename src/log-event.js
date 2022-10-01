import timeStamp from './timestamp.js';
import chalk from './chalk.js';

export default function logEvent(...args) {
    console.log(chalk.gray(timeStamp()), ...args);
}
