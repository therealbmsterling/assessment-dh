import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import Database from './database.js';

const __dirname = path.resolve(path.dirname(''));

const app = express();
const db = Database();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build/src')));
app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/process', (req, res) => {
  let message;

  const { command } = req.body;

  if (command.match(/^END$/)) {
    setTimeout(() => {
      process.exit(0);
    }, 0); // no timeout, this will execute after the res.json does

    message = 'kill';
  } else if (command.match(/^GET/)) {
    const [, key] = /GET (\S*)/.exec(command);

    message = db.get(key) || 'NULL';
  } else if (command.match(/^SET/)) {
    const [, key, value] = /SET (\S*) (\S*)/.exec(command);

    message = db.set(key, value);
  } else if (command.match(/^COUNT/)) {
    const [, value] = /COUNT (\S*)/.exec(command);

    message = db.count(value);
  } else if (command.match(/^DELETE/)) {
    const [, key] = /DELETE (\S*)/.exec(command);

    message = db.delete(key);
  } else if (command.match(/^BEGIN$/)) {
    db.begin();
  } else if (command.match(/^COMMIT$/)) {
    db.commit();
  } else if (command.match(/^ROLLBACK$/)) {
     if (!db.rollback()) {
      message = 'TRANSACTION NOT FOUND';
    }
  }

  res.json({
    status: 'success',
    message,
  });
});

app.listen(port, () => {
  console.log('started.')
});
