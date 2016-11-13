#!/usr/bin/env node --harmony

import app from '../index';
import log from '../logger';

const port = 4000;
app.listen(port, () => log(`Server has been started on 'localhost:${port}'`));
