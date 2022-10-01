import chalk from './chalk.js';

const ongoing = (status) => chalk.cyanBright('… ' + status);
const success = (status) => chalk.greenBright(' ✓' + status);
const redirect = (status) => chalk.magenta('⎌ ' + status);
const clientError = (status) => chalk.redBright('✗ ' + status);
const serverError = (status) => chalk.bgRed('✗ ' + status);

export default function statusColor(status) {
    if (status < 200) return ongoing(status);
    if (status < 300) return success(status);
    if (status < 400) return redirect(status);
    if (status < 500) return clientError(status);
    return serverError(status);
}
