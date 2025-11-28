import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.models.js";

const toggleVideoLIke = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video Id");
  }

  const like = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (like) {
    await Like.findByIdAndDelete(like?._id);
    return res
      .status(200)
      .json(new ApiResponse(200, like, "video disliked successfully"));
  }

  const liked = await Like.create({
    video: videoId,
    likedBy: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, liked, "video liked successfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id");
  }

  const like = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id,
  });

  if (like) {
    await Like.findByIdAndDelete(like._id);
    return res
      .status(200)
      .json(new ApiResponse(200, like, "comment disliked successfully"));
  }

  const liked = await Like.create({
    comment: commentId,
    likedBy: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, liked, "comment liked successfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "invalid tweet id");
  }

  const like = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  if (like) {
    await Like.findByIdAndDelete(like?._id);
    return res
      .status(200)
      .json(new ApiResponse(200, like, "tweet disliked successfully"));
  }

  const liked = await Like.create({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, liked, "tweet liked successfully"));
});

const getlikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.find({ likedBy: req.user?._id });

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "liked videos fetched successfully"),
    );
});

export { toggleVideoLIke, toggleCommentLike, toggleTweetLike, getlikedVideos };
