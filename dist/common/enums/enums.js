"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenType = exports.Gender = exports.Events = void 0;
var Events;
(function (Events) {
    Events["confirmEmail"] = "confirmEmail";
    Events["resetPassword"] = "resetPassword";
})(Events || (exports.Events = Events = {}));
var Gender;
(function (Gender) {
    Gender["male"] = "male";
    Gender["female"] = "female";
})(Gender || (exports.Gender = Gender = {}));
var TokenType;
(function (TokenType) {
    TokenType["access"] = "access";
    TokenType["refresh"] = "refresh";
})(TokenType || (exports.TokenType = TokenType = {}));
