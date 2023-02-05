import dateformat from 'date-format';
import chalk from './chalk.js';

let lastDateTime = '';

export default function timeStamp() {
    const reqTime = new Date();
    const currDateTime = chalk.cyan('╒═════ ') + dateformat('yyyy-MM-dd hh:mm:ss (UTCO):', reqTime);
    const milliseconds = chalk.cyan('├') + dateformat('SSSms', reqTime);

    const parts = [];
    if (currDateTime !== lastDateTime) parts.push(currDateTime);
    parts.push(milliseconds);

    lastDateTime = currDateTime;

    return parts.join('\n');
}
