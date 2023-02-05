import chalk from './chalk.js';
import logEvent, { logError } from './log-event.js';
import defaultMessages from './default-messages.js';
import statusColor from './status.js';

export default function middleware(req, res, next) {
    const requestStartTime = Date.now();
    let logThisRequest = true;
    const remarks = [];

    res.doNotLog = req.doNotLog = () => {
        logThisRequest = false;
    };

    res.log = (...text) => {
        remarks.push(text.join(' '));
        return res; // to allow chaining
    };

    res.time = (arg1, arg2) => {
        const process = arg2 || arg1;
        const description = arg2 ? arg1 : '';

        const t0 = new Date();
        const result = process();
        if (!result.then) {
            finish();
            return result;
        }
        return new Promise((resolve, reject) => {
            result
                .then(val => {
                    finish();
                    return resolve(val);
                })
                .catch(err => {
                    finish();
                    return reject(err);
                });
        });

        function finish() {
            const t1 = new Date();
            res.log(t1 - t0 + 'ms' + (description ? ' ' + description : ''));
        }
    };

    res.message = function resMessage(status, text, data = {}) {
        const message = text || defaultMessages[status];
        res.log(message);
        res.status(status);
        res.send({ message, ...data });
    };

    res.Error = function logError(text) {
        if (text) remarks.push(chalk.redBright(`Error: ${text}`));
        res.status(500);
        res.send({ message: 'Internal Error' });
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

            const data = [`${user}${host}`, method, url, status, requestTime, notes];

            if (res.statusCode > 399) logError(...data);
            else logEvent(...data);
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
        req.email ||
        req.session?.user?.username ||
        req.user?.username ||
        req.session?.username ||
        req.username ||
        req.session?.user?._id ||
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
