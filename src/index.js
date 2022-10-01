import logEvent from './log-event.js';
import logRequests from './middleware.js';
import chalk from './chalk.js';
import chars from './characters.js';

const log = {
    chalk,
    chars,
    event: logEvent,
    requests: logRequests,
};

export default log;

export { chalk, chars, logEvent, logRequests };
