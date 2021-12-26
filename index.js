const seqappend = require('seqappend');
const dateformat = require('date-format');
const chalk = new (require('chalk')).Instance({ level:1 });

const write = {file: ()=>{}};

const startupTime = Date.now();

let lastDate = null;

const log = {
    
    chalk,

    filename: (filename) => {
        if (filename) {
            write.file = seqappend(filename);
            write.file('\n');
        } else write.file = ()=>{};
    },

    // Add a timestamp and log to stdout; probably only used internally
    toConsole: (now, ...args) => {
        const ts = dateformat('╒═════ yyyy-MM-dd hh:mm:ss (UTCO):', now);
        const ut = upTime(now);
        const ms = dateformat('├SSSms', now);
        const timestamp = (ts !== lastDate ? ts + ' ' + ut + '\n' : '') + ms;
        lastDate = ts;
        console.log(chalk.gray(timestamp), ...args);
        
        function upTime(now) {
            const u = now - startupTime;
            const h = Math.floor(u / 3600000);
            const m = Math.floor((u - 3600000 * h) / 60000);
            const s = Math.floor((u - 3600000 * h - 60000 * m) / 1000);
            const ms = Math.floor(u - 3600000 * h - 60000 * m - 1000 * s);
            
            const hh = h ? (pad(h, 1) + `:`) : ``;
            const mm = ((h&&m) && pad(m, 2) + `:`) || (m && pad(m, 1) + `:`) || ``;
            const ss = ((h||m) ? pad(s, 2) : pad(s,1)) + `.`;
            const sss = `${pad(ms, 3)}` + ((!h && !m)?`:`:``);
            const sssss = (h||m||s||ms) ? ss+sss : '0s';
            
            
            
            
            
            return retVal = `(${chalk.cyanBright(`T₀ + ${hh}${mm}${sssss}`)})`;
            
            function pad(val, len) {
                let s = String(val);
                while (s.length < len) s = '0' + s;
                return s;
            }
        }
    },

    // Add a timestamp and log to file; probably only used internally
    toFile: (now, ...args) => {
        const timestamp = dateformat('yyyy-MM-dd hh:mm:ss.SSS', now);
        write.file(chalk.gray(timestamp) + ' ' + args.join(' ') + '\n');
    },

    // Log any event
    event: (...args) => {
        const now = new Date();
        log.toFile(now, ...args);
        log.toConsole(now, ...args);
    },

    // Middleware to app.use, to log each request:
    request: (req, res, next) => {
        
        const requestStartTime = Date.now();
        const remarks = [];

        let logThisRequest = true;
        res.doNotLog = req.doNotLog = () => {logThisRequest = false;};
        
        res.log = (text) => {
            if (text) remarks.push(text);
            return res; //allow chaining: res.log('remark').send()
        }

        res.Error = function(text) {
            if (text) remarks.push(chalk.redBright(`Error: ${text}`));
            res.status(500);
            res.send('Internal Error');
        }

            
        res.on('finish', () => {
            if (logThisRequest) {
                
                const userIp = req.get('x-real-ip') || req.ip;
                const sessionId = req.session?.sessionId || null;
                const guestId = req.guestId || null;
                
                const id = chalk.blueBright(
                                (sessionId && trimString(`Sessn:${sessionId}`, 15))
                                || (guestId && trimString(`Guest:${guestId}`, 15))
                                || userIp
                            ) + "@" + chalk.greenBright(req.hostname);

                log.event(
                    id, //user@hostname
                    chalk.yellow(req.method),
                    chalk.whiteBright(req.originalUrl),
                    statusColor(res.statusCode),
                    chalk.gray(`(${milliseconds(Date.now() - requestStartTime)})`)
                    + (remarks.length ? ` ${remarks.join(';')}` : '')
                );

            }
        });

        next();
            
    }

}


function trimString(input, maxLength) {
    const i = String(input);
    if (i.length > maxLength) return i.substring(0, maxLength - 1) + '…';
    else return i;
}

function milliseconds(dateDiff) {
    let ms = String(dateDiff);

    let d = "";
    while (ms.length) {
        if (ms.length > 3) {
            d = ',' + ms.slice(ms.length - 3, ms.length) + d;
            ms = ms.slice(0, ms.length - 3);
        } else {
            d = ms + d;
            ms = "";
        }
    }
    
    return `${d} ms`;
}

function statusColor(status) {
    if (status < 200) return chalk.cyanBright('… ' + status); //ongoing
    if (status < 300) return chalk.greenBright(status + ' ✓'); //success
    if (status < 400) return chalk.magenta('⎌ ' + status); //redirect
    if (status < 500) return chalk.redBright('✗ ' + status); //client error
    return chalk.bgRed('✗ ' + status); //server error
}

log.chars = {
    check: '✓', greenCheck: chalk.green('✓'),
    X: '✗', redX: chalk.red('✗'),
    db: '🛢',
    mail: '✉',
    waiting: '…'
}

module.exports = log;