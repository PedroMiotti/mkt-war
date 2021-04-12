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

import User = require('./routes/user');
import Match = require('./routes/match');

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

// Routes
app.use('/api/v1/user', User);
app.use('/api/v1/match', Match);

export = app;
