import dateformat from 'date-format';
import upTime from './uptime.js';

let lastDateTime = '';

export default function timeStamp() {
    const now = new Date();
    const currDateTime = dateformat('╒═════ yyyy-MM-dd hh:mm:ss (UTCO):', now);
    const millisecs = dateformat('├SSSms', now);

    const parts = [];
    if (currDateTime !== lastDateTime) parts.push([currDateTime, upTime(now)].join(' '));
    parts.push(millisecs);

    lastDateTime = currDateTime;

    return parts.join('\n');
}
