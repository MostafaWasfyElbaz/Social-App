"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupSwagger;
const path_1 = __importDefault(require("path"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const swaggerDocument = yamljs_1.default.load(path_1.default.resolve(__dirname, "../docs/swagger.yaml"));
function setupSwagger(app) {
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
}
