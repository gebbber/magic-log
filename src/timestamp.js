import dateformat from 'date-format';
import chalk from './chalk.js';

let lastDateTime = {};

export default function timeStamp(location) {
    const color = location === 'stderr' ? chalk.white.bgRed : a => a;
    const reqTime = new Date();
    const currDateTime = '╒═════ ' + dateformat('yyyy-MM-dd hh:mm:ss (UTCO):', reqTime);
    const milliseconds = '├' + color(dateformat('SSSms', reqTime));

    const parts = [];
    if (currDateTime !== lastDateTime[location]) parts.push(currDateTime);
    parts.push(milliseconds);

    lastDateTime[location] = currDateTime;

    return parts.join('\n');
}
