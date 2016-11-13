// @flow

import Express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import flash from 'flash';
import routes from './routes';

const app = new Express();
const logger = morgan('combined');

app.use(methodOverride('_method'));
app.use(logger);
app.set('view engine', 'pug');
app.use('/assets', Express.static('node_modules'));
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

export default app;
