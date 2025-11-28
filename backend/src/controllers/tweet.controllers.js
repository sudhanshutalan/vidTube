import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.models.js";

const createTweet = asyncHandler(async (req, res) => {
  const { tweetContent } = req.body;

  if (!tweetContent) {
    throw new ApiError(400, "Enter tweet content. Tweet Content is required");
  }

  const tweet = await Tweet.create({
    content: tweetContent,
    owner: req.user?._id,
  });

  if (!tweet) {
    throw new ApiError(500, "failed to create tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { data: tweet }, "tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "invalid user id");
  }

  const userTweets = await Tweet.find({ owner: userId });

  if (!userTweets) {
    throw new ApiError(400, "tweets not found by given id");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "user tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { tweetContent } = req.body;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "invalid tweet Id");
  }

  if (!tweetContent) {
    throw new ApiError(400, "tweet content is required");
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: tweetContent,
      },
    },
    { new: true },
  );

  if (!updatedTweet) {
    throw new ApiError(500, "failed to delete tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "invalid tweet Id");
  }

  const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

  if (!deletedTweet) {
    throw new ApiError(500, "failed to delete tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTweet, "tweet deleted successfully"));
});
export { createTweet, getUserTweets, updateTweet, deleteTweet };
