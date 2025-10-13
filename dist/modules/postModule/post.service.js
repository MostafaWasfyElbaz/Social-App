"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostServices = void 0;
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const nanoid_1 = require("nanoid");
class PostServices {
    postRepository;
    s3Services;
    constructor(postRepository = new DB_1.PostRepository(), s3Services = new utils_1.S3Services()) {
        this.postRepository = postRepository;
        this.s3Services = s3Services;
    }
    createPost = async (req, res, next) => {
        if (req.body.tags?.length) {
            if (req.body.tags.includes(res.locals.user._id.toString())) {
                throw new utils_1.invalidTagsError([
                    `${res.locals.user._id.toString()} yourself`,
                ]);
            }
            const tagsCount = await this.postRepository.checkTags(req.body.tags);
            if (tagsCount.length !== req.body.tags.length) {
                const tags = tagsCount.map((tag) => tag._id.toString());
                const invalidTags = req.body.tags.filter((tag) => !tags.includes(tag));
                throw new utils_1.invalidTagsError(invalidTags);
            }
        }
        const files = req.files;
        const assetsFolderId = (0, nanoid_1.nanoid)(15);
        const path = `${res.locals.user._id}/posts/${assetsFolderId}`;
        let uploadedFiles = [];
        if (files?.length > 0) {
            uploadedFiles = await this.s3Services.uploadMultiFiles({
                files,
                Path: path,
            });
            if (uploadedFiles?.length != files.length) {
                throw new utils_1.failedToUpload();
            }
        }
        const post = await this.postRepository.create({
            data: {
                ...req.body,
                attachments: uploadedFiles,
                assetsFolderId,
                createdBy: res.locals.user._id,
            },
        });
        if (!post) {
            throw new utils_1.faildToCreatePost();
        }
        return (0, utils_1.successHandler)({
            res,
            msg: "Post created successfully",
            status: 201,
        });
    };
    likeUnlikePost = async (req, res, next) => {
        const { postId, action } = req.body;
        const user = res.locals.user;
        const post = await this.postRepository.findOne({
            filter: {
                _id: postId,
                $or: (0, DB_1.availabilityFilter)(user),
            },
        });
        if (!post) {
            throw new utils_1.notFoundError();
        }
        if (action === "like") {
            await post.updateOne({
                $addToSet: {
                    likes: user._id,
                },
            });
        }
        if (action === "unlike") {
            await post.updateOne({
                $pull: {
                    likes: user._id,
                },
            });
        }
        return (0, utils_1.successHandler)({
            res,
            data: post,
            msg: action === "like"
                ? "Post liked successfully"
                : "Post unliked successfully",
            status: 200,
        });
    };
}
exports.PostServices = PostServices;
