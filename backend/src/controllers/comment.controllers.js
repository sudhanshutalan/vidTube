import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Comment } from "../models/comment.models.js";
import { Video } from "../models/video.models.js";

const createComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { commentContent } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  if (!commentContent) {
    throw new ApiError(400, "comment Ccontent is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  const comment = await Comment.create({
    content: commentContent,
    video: videoId,
    owner: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.params;
  const { commentContent } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid commnet id");
  }

  if (!commentContent) {
    throw new ApiError(400, "comment content is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: commentContent,
      },
    },
    { new: true },
  );

  if (!comment) {
    throw new ApiError(500, "comment updation failed");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { videoId, commentId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new ApiError(400, "comment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment deleted successfully"));
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  const comments = await Comment.find({ video: videoId });

  if (!comments) {
    throw new ApiError(400, "no comments found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "all comments feteched successfully"));
});
export { createComment, updateComment, deleteComment, getVideoComments };
