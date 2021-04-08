"use strict";
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/mktwar', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
module.exports = mongoose;
//# sourceMappingURL=index.js.map