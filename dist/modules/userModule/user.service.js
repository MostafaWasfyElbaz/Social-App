"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../utils/index");
class UserServices {
    s3Services;
    constructor(s3Services = new index_1.S3Services()) {
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
            return (0, index_1.successHandler)({
                res,
                msg: "Profile picture uploaded successfully",
                data: { Key },
                status: 200,
            });
        }
        catch (error) {
            throw error;
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
            return (0, index_1.successHandler)({
                res,
                msg: "PreSigned URL generated successfully",
                data: { url, Key },
                status: 200,
            });
        }
        catch (error) {
            throw error;
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
            return (0, index_1.successHandler)({
                res,
                msg: "Cover images uploaded successfully",
                data: { keys },
                status: 200,
            });
        }
        catch (error) {
            throw error;
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
                throw new index_1.notFoundError();
            }
            res.set("Content-Type", file.ContentType);
            if (downloadName) {
                res.set("Content-Disposition", `attachment; filename=${downloadName}.${Key.split('.').pop()}`);
            }
            return (0, index_1.successHandler)({
                res,
                msg: "File downloaded successfully",
                data: { stream },
                status: 200,
            });
        }
        catch (error) {
            throw error;
        }
    };
    getFilesOrDownloadPreSignedUrl = async (req, res, next) => {
        try {
            const { path } = req.params;
            const { downloadName, download } = req.query;
            const Key = path.join("/");
            const url = await this.s3Services.getAssetPreSignedUrl({ Key: Key, downloadName: downloadName, download: download });
            return (0, index_1.successHandler)({
                res,
                msg: "link generated successfully",
                data: { url },
                status: 200,
            });
        }
        catch (error) {
            throw error;
        }
    };
    deleteProfileImage = async (req, res, next) => {
        try {
            const { path } = req.params;
            const Key = path.join("/");
            if (res.locals.user.profileImage !== Key) {
                throw new index_1.unauthorizedError();
            }
            const file = await this.s3Services.deleteAsset({ Key });
            return (0, index_1.successHandler)({
                res,
                msg: "profile image deleted successfully",
                data: { file },
                status: 200,
            });
        }
        catch (error) {
            throw error;
        }
    };
    deleteCoverImages = async (req, res, next) => {
        try {
            const { urls } = req.body;
            if (urls.length === 0) {
                throw new index_1.notFoundError();
            }
            for (const url of urls) {
                if (!res.locals.user.coverImages.includes(url)) {
                    throw new index_1.unauthorizedError();
                }
            }
            const file = await this.s3Services.deleteAssets({ urls });
            return (0, index_1.successHandler)({
                res,
                msg: "cover images deleted successfully",
                data: { file },
                status: 200,
            });
        }
        catch (error) {
            throw error;
        }
    };
    updateUserBasicInfo = async (req, res, next) => {
        try {
            const user = res.locals.user;
            const { firstName, lastName } = req.body;
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            await user.save();
            return (0, index_1.successHandler)({
                res,
                msg: "User info updated successfully",
                data: { user },
                status: 200,
            });
        }
        catch (error) {
            throw error;
        }
    };
}
exports.default = UserServices;
