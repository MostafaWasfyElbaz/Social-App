import { Router } from "express";
import UserServices from "./user.service";
import { uploadFile } from "../../utils/index";
import { auth } from "../../middleware/index";

const router = Router();

const userServices = new UserServices();
const routes = {
    uploadProfilePicture: "/upload-profile-picture",
    uploadCoverImages: "/upload-cover-images",
    uploadFileWithPresignedUrl: "/upload-file-with-presigned-url",
    getFilesOrDownload: "/uploads/*path",
    getFilesOrDownloadPreSignedUrl: "/pre-signed-url/uploads/*path",
    deleteProfileImage: "/uploads/delete-profile-image/*path",
    deleteCoverImages: "/uploads/delete-cover-images/*path",
    updateUserBasicInfo: "/update-user-basic-info",
}

router.patch(routes.uploadProfilePicture,auth(),uploadFile({}).single("profilePicture"), userServices.uploadProfilePicture);
router.patch(routes.uploadCoverImages,auth(),uploadFile({}).array("coverImages",5), userServices.uploadCoverImages);
router.patch(routes.uploadFileWithPresignedUrl,auth(), userServices.uploadFileWithPreSignedUrl);
router.patch(routes.updateUserBasicInfo,auth(), userServices.updateUserBasicInfo);

router.get(routes.getFilesOrDownload, userServices.getFilesOrDownload);
router.get(routes.getFilesOrDownloadPreSignedUrl, userServices.getFilesOrDownloadPreSignedUrl);

router.delete(routes.deleteProfileImage, auth(),userServices.deleteProfileImage);
router.delete(routes.deleteCoverImages, auth(),userServices.deleteCoverImages);
export default router;
