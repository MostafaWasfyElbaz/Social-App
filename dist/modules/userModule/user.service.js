"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../DB/index");
const index_2 = require("../../utils/index");
const stream_1 = require("stream");
const util_1 = require("util");
const pipelinePromise = (0, util_1.promisify)(stream_1.pipeline);
class UserServices {
    userRepo;
    s3Services;
    constructor(userRepo = new index_1.UserRepository(), s3Services = new index_2.S3Services()) {
        this.userRepo = userRepo;
        this.s3Services = s3Services;
    }
    uploadProfilePicture = async (req, res, next) => {
        try {
            const user = res.locals.user;
            const { file } = req;
            const Key = await this.s3Services.uploadSingleFile({
                file: file,
                Path: `${user._id}/profilePicture`,
            });
            user.profileImage = Key;
            await user.save();
            return (0, index_2.successHandler)({
                res,
                msg: "Profile picture uploaded successfully",
                data: { Key },
                status: 200,
            });
        }
        catch (error) {
            next(error);
        }
    };
    uploadFileWithPreSignedUrl = async (req, res, next) => {
        try {
            const user = res.locals.user;
            const { ContentType, Originalname } = req.body;
            const { url, Key } = await this.s3Services.preSignedUrl({
                ContentType,
                Originalname,
                Path: `${user._id}/presigned-profilePicture`,
            });
            return (0, index_2.successHandler)({
                res,
                msg: "PreSigned URL generated successfully",
                data: { url, Key },
                status: 200,
            });
        }
        catch (error) {
            next(error);
        }
    };
    uploadCoverImages = async (req, res, next) => {
        try {
            const user = res.locals.user;
            const { files } = req;
            const keys = await this.s3Services.uploadMultiFiles({
                files: files,
                Path: `${user._id}/coverImages`,
            });
            user.coverImages = keys;
            await user.save();
            return (0, index_2.successHandler)({
                res,
                msg: "Cover images uploaded successfully",
                data: { keys },
                status: 200,
            });
        }
        catch (error) {
            next(error);
        }
    };
    getFilesOrDownload = async (req, res, next) => {
        try {
            const { path } = req.params;
            const { downloadName } = req.query;
            const Key = path.join("/");
            const file = await this.s3Services.getAsset({ Key });
            const stream = file.Body;
            if (!file?.Body) {
                throw new index_2.notFoundError();
            }
            res.set("Content-Type", file.ContentType);
            if (downloadName) {
                res.set("Content-Disposition", `attachment; filename=${downloadName}.${Key.split('.').pop()}`);
            }
            return await pipelinePromise(stream, res);
        }
        catch (error) {
            next(error);
        }
    };
    getFilesOrDownloadPreSignedUrl = async (req, res, next) => {
        try {
            const { path } = req.params;
            const { downloadName, download } = req.query;
            const Key = path.join("/");
            const url = await this.s3Services.getAssetPreSignedUrl({ Key: Key, downloadName: downloadName, download: download });
            return (0, index_2.successHandler)({
                res,
                msg: "link generated successfully",
                data: { url },
                status: 200,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteProfileImage = async (req, res, next) => {
        try {
            const { path } = req.params;
            const Key = path.join("/");
            if (res.locals.user.profileImage !== Key) {
                throw new index_2.unauthorizedError();
            }
            const file = await this.s3Services.deleteAsset({ Key });
            return (0, index_2.successHandler)({
                res,
                msg: "profile image deleted successfully",
                data: { file },
                status: 200,
            });
        }
        catch (error) {
            next(error);
        }
    };
    deleteCoverImages = async (req, res, next) => {
        try {
            const { urls } = req.body;
            if (urls.length === 0) {
                throw new index_2.notFoundError();
            }
            for (const url of urls) {
                if (!res.locals.user.coverImages.includes(url)) {
                    throw new index_2.unauthorizedError();
                }
            }
            const file = await this.s3Services.deleteAssets({ urls });
            return (0, index_2.successHandler)({
                res,
                msg: "cover images deleted successfully",
                data: { file },
                status: 200,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = UserServices;
