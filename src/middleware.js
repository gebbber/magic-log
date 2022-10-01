import chalk from './chalk.js';
import logEvent from './log-event.js';
import resMessage from './res-message.js';
import statusColor from './status.js';

export default function middleware(req, res, next) {
    const requestStartTime = Date.now();
    let logThisRequest = true;
    const remarks = [];

    res.doNotLog = req.doNotLog = () => {
        logThisRequest = false;
    };

    res.log = (text) => {
        if (text) remarks.push(text);
        return res; // to allow chaining
    };

    res.message = resMessage;

    res.Error = function logError(text) {
        if (text) remarks.push(chalk.redBright(`Error: ${text}`));
        res.status(500);
        res.send('Internal Error');
    };

    res.on('finish', () => {
        if (logThisRequest) {
            const user = chalk.blueBright(findUser(req));
            const host = `[${chalk.greenBright(findHost(req))}]`;
            const method = chalk.yellow(req.method);
            const url = chalk.whiteBright(req.originalUrl);
            const status = statusColor(res.statusCode);
            const notes = remarks.join(';') || '';
            const requestTime = chalk.gray(`(${milliseconds(Date.now() - requestStartTime)})`);

            logEvent(`${user}${host}`, method, url, status, requestTime, notes);
        }
    });

    next();
}

function findUser(req) {
    const ipAddress = req.get('x-real-ip') || req.ip;
    return (
        req.session?.user?.email ||
        req.user?.email ||
        req.session?.email ||
        req?.email ||
        req.session?.user._id ||
        req.session?.userId ||
        req.userId ||
        ipAddress
    );
}

function findHost(req) {
    return req.subdomain || req.hostname;
}

function milliseconds(dateDiff) {
    let ms = String(dateDiff);

    let d = '';
    while (ms.length) {
        if (ms.length > 3) {
            d = ',' + ms.slice(ms.length - 3, ms.length) + d;
            ms = ms.slice(0, ms.length - 3);
        } else {
            d = ms + d;
            ms = '';
        }
    }

    return `${d} ms`;
}
