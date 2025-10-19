import { Router } from "express";
import UserServices from "./user.service";
import { uploadFile } from "../../utils/index";
import { auth } from "../../middleware/index";
import { validationMiddleware } from "../../middleware";
import { acceptFriendRequestSchema, deleteFriendRequestSchema, unfriendSchema, sendFriendRequestSchema, blockUserSchema } from "./user.validation";

const router = Router();

const userServices = new UserServices();
const routes = {
    sendFriendRequest: "/send-friend-request/:to",
    uploadProfilePicture: "/upload-profile-picture",
    uploadCoverImages: "/upload-cover-images",
    uploadFileWithPresignedUrl: "/upload-file-with-presigned-url",
    acceptFriendRequest: "/accept-friend-request/:from",
    deleteFriendRequest: "/delete-friend-request/:to",
    unfriend: "/unfriend/:friendId",
    blockUser: "/block-user/:userId",    
    getFilesOrDownloadPreSignedUrl: "/pre-signed-url/uploads/*path",
    getFilesOrDownload: "/uploads/*path",
    deleteProfileImage: "/uploads/delete-profile-image/*path",
    deleteCoverImages: "/uploads/delete-cover-images/*path",
    updateUserBasicInfo: "/update-user-basic-info",
}

router.post(routes.sendFriendRequest,auth(), validationMiddleware(sendFriendRequestSchema),userServices.sendFriendRequest);

router.patch(routes.acceptFriendRequest,auth(), validationMiddleware(acceptFriendRequestSchema),userServices.acceptFriendRequest);
router.patch(routes.deleteFriendRequest,auth(), validationMiddleware(deleteFriendRequestSchema),userServices.deleteFriendRequest);
router.patch(routes.unfriend,auth(), validationMiddleware(unfriendSchema),userServices.unfriend);
router.patch(routes.blockUser,auth(), validationMiddleware(blockUserSchema),userServices.blockUser);
router.patch(routes.uploadProfilePicture,auth(),uploadFile({}).single("profilePicture"), userServices.uploadProfilePicture);
router.patch(routes.uploadCoverImages,auth(),uploadFile({}).array("coverImages",5), userServices.uploadCoverImages);
router.patch(routes.uploadFileWithPresignedUrl,auth(), userServices.uploadFileWithPreSignedUrl);
router.patch(routes.updateUserBasicInfo,auth(), userServices.updateUserBasicInfo);

router.get(routes.getFilesOrDownload, userServices.getFilesOrDownload);
router.get(routes.getFilesOrDownloadPreSignedUrl, userServices.getFilesOrDownloadPreSignedUrl);

router.delete(routes.deleteProfileImage, auth(),userServices.deleteProfileImage);
router.delete(routes.deleteCoverImages, auth(),userServices.deleteCoverImages);

export default router;
