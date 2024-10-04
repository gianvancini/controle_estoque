"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var usuario_1 = require("../controllers/usuario");
var router = express_1.default.Router();
router.post('/usuarios', usuario_1.postUsuario);
exports.default = router;
//# sourceMappingURL=usuario.js.map