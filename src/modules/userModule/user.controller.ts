import { Router } from "express";
import UserServices from "./user.service";
import { uploadFile } from "../../utils/index";
import { auth } from "../../middleware/index";

const router = Router();

const userServices = new UserServices();

router.patch("/upload-profile-picture",auth(),uploadFile({}).single("profilePicture"), userServices.uploadProfilePicture);
router.patch("/upload-cover-images",auth(),uploadFile({}).array("coverImages",5), userServices.uploadCoverImages);
router.patch("/upload-file-with-presigned-url",auth(), userServices.uploadFileWithPreSignedUrl);

router.get("/uploads/*path", userServices.getFilesOrDownload);
router.get("/pre-signed-url/uploads/*path", userServices.getFilesOrDownloadPreSignedUrl);

router.delete("/uploads/delete-profile-image/*path", auth(),userServices.deleteProfileImage);
router.delete("/uploads/delete-cover-umages/*path", auth(),userServices.deleteCoverImages);
export default router;
