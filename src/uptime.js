import chalk from './chalk.js';

const startupTime = Date.now();

export default function upTime(now) {
    const u = now - startupTime;

    const h = Math.floor(u / 3600000);
    const m = Math.floor((u - 3600000 * h) / 60000);
    const s = Math.floor((u - 3600000 * h - 60000 * m) / 1000);
    const ms = Math.floor(u - 3600000 * h - 60000 * m - 1000 * s);

    const hh = h ? +`${h}:` : ``;
    const mm = hh || m ? `${String(m).padStart(h ? 2 : 1, '0')}:` : ``;
    const ss = String(s).padStart(mm ? 2 : 1, '0');
    const sss = String(ms).padStart(3, '0') + (!h && !m ? 's' : '');

    const uptime = h || m || s || ms ? `${hh}${mm}${ss}.${sss}` : '0s';

    return `(${chalk.cyanBright(`T₀ + ${uptime}`)})`;
}
