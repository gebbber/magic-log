# magic-log v1.1.0

## Usage: (NodeJS)

### Initialization, logging events, adding middleware:

```javascript
/// server.js
import express from 'express';
import logRequests, { logEvent, logError } from 'magic-log';

const app = express();

try {
    startServer();
    logEvent('Starting server...'); // Log a single event
} catch (err) {
    logError('Error starting server'); // Use console.error()
}

// Add middleware to log each request:
app.use(logRequests);
```

### Use `req.doNotLog()` to avoid logging for a single request:

```javascript
// Cancel logging for a single request:
app.get('/robots.txt', (req, res) => {
    req.doNotLog();
    res.setStatus(404).send('not found');
});
```

### Use `res.log(remark)` to add a remark to a given request:

```javascript
// res.log can be used to add remarks to the log entry:
app.get('/', (req, res) => {
    res.log(`in 'Hello World' endpoint`);
    res.send('Hello World');
});
```

### `res.message(status, text)` can be used to send a response:

`text` is logged to the server console and sent in JSON as `{message: text}`. Status codes > 399 use `console.error`; other use `console.log`.

```javascript
app.get('/user', (req, res) => {
    if (user) return res.message(200, 'User logged in');
    // equivalent to:
    res.status(200).log('User logged in').send({ message: 'User logged in' });
});
```

### Use `res.Error(text)` to handle internal errors:

`text` is logged to the server console using `console.error`, but only `{message: 'Internal Error'}` is sent.

```javascript
app.get('/data', (req, res) => {
    if (internalError) return res.Error(`in app.get('/data')`);
    // equivalent to:
    res.status(500).log(`in app.get('/data')`).send({ message: 'Internal Error' });
});
```
