# magic-log v0.0.1

## Usage: (NodeJS)
```javascript
/// server.js
const express = require('express');
const app = express();

const log = require('magic-log');
require('./log-messages'); // Add custom messages

// Log an event not associated with a request:
log.event('Starting server...');

// Start saving to a log file:
log.filename('/logs/auth.log.ans');
// Notes: 
// - Before this declaration, it would just go
//   to stdout
// - Use log.filename() or log.filename(null)
//   to go back to stdout

// Automatically log all requests:
app.use(log.request);

// Cancel logging for a single request:
app.get('/robots.txt', (req, res) => {
    req.doNotLog(); //both work
    res.doNotLog(); //the same
    res.setStatus(404).send('not found');
    req.doNotLog(); //works here too
});

// res.log can be used to add remarks to the log entry:
app.get('/', (req, res) => {
    res.log('Sending "Hello World"');
    res.send('Hello World');
    res.log('Sent it');
})

// res.Error can be used to conveniently:
// - Add a remark
// - Set status 500
// - Send "Internal Error"
app.get('/data', (req, res) => {
    res.Error("No database available"); // Remark isn't sent in response
});
```

## Custom Messages:
```javascript
//log-messages.js
const log = require('magic-log');
const chalk = log.chalk;

log.listening = (port) => log.event('Server listening on port',chalk.yellowBright(port));

```