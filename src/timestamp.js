import dateformat from 'date-format';

let lastDateTime = '';

export default function timeStamp() {
    const reqTime = new Date();
    const currDateTime = '╒═════ ' + dateformat('yyyy-MM-dd hh:mm:ss (UTCO):', reqTime);
    const milliseconds = '├' + dateformat('SSSms', reqTime);

    const parts = [];
    if (currDateTime !== lastDateTime) parts.push(currDateTime);
    parts.push(milliseconds);

    lastDateTime = currDateTime;

    return parts.join('\n');
}
