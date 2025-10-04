"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.decodeToken = void 0;
const index_1 = require("../utils/index");
const index_2 = require("../common/index");
const index_3 = require("../DB/index");
const userModel = new index_3.UserRepository();
const decodeToken = async ({ authorization, tokenType = index_2.TokenType.access, }) => {
    try {
        if (!authorization) {
            throw new index_1.invalidCredentialsError();
        }
        if (!authorization.startsWith(`${process.env.BEARER_KEY}`)) {
            throw new index_1.invalidCredentialsError();
        }
        const token = authorization.split(` `)[1];
        if (!token) {
            throw new index_1.invalidCredentialsError();
        }
        const decodedToken = (0, index_1.verifyToken)({
            token,
            secret: tokenType == index_2.TokenType.access
                ? process.env.ACCESS_SIGNITURE
                : process.env.REFRESH_SIGNITURE,
        });
        if (!decodedToken) {
            throw new index_1.invalidCredentialsError();
        }
        const user = await userModel.findById({ id: decodedToken.id });
        if (!user) {
            throw new index_1.notFoundError();
        }
        if (!user.isConfirmed) {
            throw new index_1.userNotConfirmedError();
        }
        if (user.changedCredentialsAt && user.changedCredentialsAt.getTime() >= decodedToken.iat * 1000) {
            throw new index_1.invalidCredentialsError();
        }
        return { user, decodedToken };
    }
    catch (error) {
        throw error;
    }
};
exports.decodeToken = decodeToken;
const auth = () => {
    return async (req, res, next) => {
        try {
            const { user } = await (0, exports.decodeToken)({ authorization: req.headers.authorization });
            res.locals.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.auth = auth;
