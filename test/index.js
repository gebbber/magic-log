import express from 'express';
import log from '../src/index.js';

const app = express();

app.use(log.requests);

app.get('/', (req, res) => {
    res.send('Response');
});

log.event('Going to listen...');
app.listen(3000, () => log.event('Listening on port 3000'));
