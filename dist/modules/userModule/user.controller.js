"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const index_1 = require("../../utils/index");
const index_2 = require("../../middleware/index");
const router = (0, express_1.Router)();
const userServices = new user_service_1.default();
const routes = {
    uploadProfilePicture: "/upload-profile-picture",
    uploadCoverImages: "/upload-cover-images",
    uploadFileWithPresignedUrl: "/upload-file-with-presigned-url",
    getFilesOrDownload: "/uploads/*path",
    getFilesOrDownloadPreSignedUrl: "/pre-signed-url/uploads/*path",
    deleteProfileImage: "/uploads/delete-profile-image/*path",
    deleteCoverImages: "/uploads/delete-cover-images/*path",
    updateUserBasicInfo: "/update-user-basic-info",
};
router.patch(routes.uploadProfilePicture, (0, index_2.auth)(), (0, index_1.uploadFile)({}).single("profilePicture"), userServices.uploadProfilePicture);
router.patch(routes.uploadCoverImages, (0, index_2.auth)(), (0, index_1.uploadFile)({}).array("coverImages", 5), userServices.uploadCoverImages);
router.patch(routes.uploadFileWithPresignedUrl, (0, index_2.auth)(), userServices.uploadFileWithPreSignedUrl);
router.patch(routes.updateUserBasicInfo, (0, index_2.auth)(), userServices.updateUserBasicInfo);
router.get(routes.getFilesOrDownload, userServices.getFilesOrDownload);
router.get(routes.getFilesOrDownloadPreSignedUrl, userServices.getFilesOrDownloadPreSignedUrl);
router.delete(routes.deleteProfileImage, (0, index_2.auth)(), userServices.deleteProfileImage);
router.delete(routes.deleteCoverImages, (0, index_2.auth)(), userServices.deleteCoverImages);
exports.default = router;
