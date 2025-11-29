import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.models.js";
import { Video } from "../models/video.models.js";
import { Comment } from "../models/comment.models.js";
import { Tweet } from "../models/tweet.models.js";
import { User } from "../models/users.models.js";

const toggleVideoLIke = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  // check if video id is in correct format or not
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid video Id");
  }

  // check if video exists or not
  const videoExists = await Video.findById(videoId);
  if (!videoExists) {
    throw new ApiError(400, "video does not exists");
  }

  //try to find and delete existing like
  const existingLike = await Like.findOneAndDelete({
    video: videoId,
    likedBy: req.user?._id,
  });

  let isLiked = false;

  // if like document not exists then create new one
  if (!existingLike) {
    await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });
    isLiked = true;
  }

  //record likeCount
  const totalLikes = await Like.countDocuments({ video: videoId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isLiked, totalLikes },
        isLiked ? "Video liked" : "Video disliked",
      ),
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "invalid comment id");
  }

  const commentExists = await Comment.findById(commentId);
  if (!commentExists) {
    throw new ApiError(400, "comment not found");
  }

  //check for existing like and if exists delete it
  const existingLike = await Like.findOneAndDelete({
    comment: commentId,
    likedBy: req.user?._id,
  });

  //like flag (set to false)
  let isLiked = false;

  //check for like exists or not if not exists the create new like
  if (!existingLike) {
    await Like.create({
      comment: commentId,
      likedBy: req.user?._id,
    });

    //like flag (set to false)
    isLiked = true;
  }

  //counting total likes
  const totalLikes = await Like.countDocuments({ comment: commentId });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isLiked, totalLikes },
        isLiked ? "comment liked" : "comment disliked",
      ),
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "invalid tweet id");
  }

  //check for tweet exists or not
  const existingTweet = await Tweet.findById(tweetId);
  if (!existingTweet) {
    throw new ApiError(400, "tweet not found");
  }

  //check for existing like if exists deletes it
  const existingLike = await Like.findOneAndDelete({
    tweet: tweetId,
    likedBy: req.user?._id,
  });

  //like flag (set to false)
  let isLiked = false;

  //  if no existinglike then creates new one
  if (!existingLike) {
    await Like.create({
      tweet: tweetId,
      likedBy: req.user?._id,
    });

    //like flag (set to true)
    isLiked = true;
  }

  const totalLikes = await Like.countDocuments({ tweet: tweetId });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isLiked, totalLikes },
        isLiked ? "tweet liked" : "tweet disliked",
      ),
    );
});

const getlikedVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "likedAt",
    sortType = "desc",
  } = req.query;

  const options = {
    page: +page,
    limit: +limit,
  };

  const sortOrder = sortType.toLowerCase() === "desc" ? -1 : 1;

  const pipeline = Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $project: {
        video: 1,
        likedAt: "$createdAt",
      },
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$video", { likedAt: "$likedAt" }],
        },
      },
    },
    {
      $sort: { [sortBy]: sortOrder },
    },
  ]);

  const paginatedVideos = await Like.aggregatePaginate(pipeline, options);
  if (!paginatedVideos) {
    throw new ApiError(400, "Failed to load Liked Videos!, Please try again ");
  }

  res.status(200).json(new ApiResponse(200, paginatedVideos));
});

export { toggleVideoLIke, toggleCommentLike, toggleTweetLike, getlikedVideos };
