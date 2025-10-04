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
router.patch("/upload-profile-picture", (0, index_2.auth)(), (0, index_1.uploadFile)({}).single("profilePicture"), userServices.uploadProfilePicture);
router.patch("/upload-cover-images", (0, index_2.auth)(), (0, index_1.uploadFile)({}).array("coverImages", 5), userServices.uploadCoverImages);
router.patch("/upload-file-with-presigned-url", (0, index_2.auth)(), userServices.uploadFileWithPreSignedUrl);
router.get("/uploads/*path", userServices.getFilesOrDownload);
router.get("/pre-signed-url/uploads/*path", userServices.getFilesOrDownloadPreSignedUrl);
router.delete("/uploads/delete-profile-image/*path", (0, index_2.auth)(), userServices.deleteProfileImage);
router.delete("/uploads/delete-cover-umages/*path", (0, index_2.auth)(), userServices.deleteCoverImages);
exports.default = router;
