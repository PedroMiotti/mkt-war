"use strict";

// IMPORTS 
// Express
import express = require('express');
const app: express.Application = express();
// Cors
import cors = require('cors');
// Helmet 
import helmet = require('helmet');
// Body Parser
import bodyParser = require('body-parser');

import User = require('./routes/user.js');

// CONFIG 
// Helmet
app.use(helmet());
// cors
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  exposedHeaders: ["set-cookie"],
}));
// BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!')
})

app.use('/api/v1/user', User);

export = app;
