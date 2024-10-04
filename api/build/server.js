"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./src/app"));
var data_source_1 = require("./src/data-source");
var PORT = process.env.PORT || 3001;
data_source_1.AppDataSource.initialize()
    .then(function () {
    console.log('Data Source has been initialized!');
    app_1.default.listen(PORT, function () {
        console.log("Server is running on port ".concat(PORT));
    });
})
    .catch(function (error) {
    console.error('Error during Data Source initialization:', error);
});
//# sourceMappingURL=server.js.map