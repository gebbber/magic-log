# magic-log v1.0.0

## Usage: (NodeJS)

### Initialization, logging events, adding middleware:

```javascript
/// server.js
import express from 'express';
import { logRequests, logEvent } from 'magic-log';

const app = express();

// Log a single event
logEvent('Starting server...');

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

```javascript
// res.message can be used to send a message:
app.get('/user', (req, res) => {
    // send { message: 'User logged in' } as JSON:
    if (user) return res.message(200, 'User logged in');

    // response type is plain text for all other status codes:
    res.message(401, 'No user');
});
```

### Use `res.Error(text)` to handle internal errors:

```javascript
app.get('/data', (req, res) => {
    try {
        throw new Error('not implemented');
    } catch (err) {
        console.log(err);

        // log message with request, and send 'Internal error':
        res.Error(`in app.get('/data')`);
    }
});
```

## v1.0.0 Release Notes

-   Converted to ESM modules
-   Removed log to file; logging is to console only
-   Upgaded to date-format v4
-   Changed API
