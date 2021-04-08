"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS 
const { createServer } = require('http');
// Socket IO
const createConnection = require("./socketio.js");
//App.js
const app_ = require("./app.js");
const PORT = process.env.PORT || 3001;
const http = createServer(app_);
createConnection(http);
http.listen(PORT, () => {
    console.log(`Server up ! ${PORT}`);
});
//# sourceMappingURL=server.js.map