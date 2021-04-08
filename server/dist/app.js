"use strict";
// IMPORTS 
// Express
const express = require("express");
const app = express();
// Cors
const cors = require("cors");
// Helmet 
const helmet = require("helmet");
// Body Parser
const bodyParser = require("body-parser");
const User = require("./routes/user.js");
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/v1/user', User);
module.exports = app;
//# sourceMappingURL=app.js.map