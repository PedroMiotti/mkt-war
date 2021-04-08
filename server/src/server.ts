"use strict";

// IMPORTS 
const { createServer } = require('http');
// Socket IO
import createConnection = require('./socketio.js');
//App.js
import app_ = require('./app.js');


const PORT: (string | number) = process.env.PORT || 3001;
const http = createServer(app_);

createConnection(http);


http.listen(PORT, () => {
  console.log(`Server up ! ${PORT}`);

});



