"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// app.ts
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var usuario_1 = __importDefault(require("./routes/usuario"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api", usuario_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map