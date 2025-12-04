import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";
import { Subscription } from "../models/subscription.models.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  //validate channel id
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel Id");
  }

  //check channel exists or not
  const channelExists = await User.findById(channelId);
  if (!channelExists) {
    throw new ApiError(400, "channel does not exists");
  }

  // prevent self subscription
  if (channelId === req.user?._id.toString()) {
    throw new ApiError(400, "you cannot subscribe to your own channel");
  }

  //check wether channel is alreaday subscribed by user
  const existingSubscribe = await Subscription.findOneAndDelete({
    channel: channelId,
    subscriber: req.user?._id,
  });

  let isSubscribed = false;

  if (!existingSubscribe) {
    await Subscription.create({
      channel: channelId,
      subscriber: req.user?._id,
    });
    isSubscribed = true;
  }

  // record subscriberCount
  const totalSubscriber = await Subscription.countDocuments({
    channel: channelId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isSubscribed, totalSubscriber },
        isSubscribed ? "channel Subscribed" : "Channel Unsubscribed",
      ),
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const options = {
    page: +page,
    limit: +limit,
  };

  const sortOrder = sortType.toLowerCase() === "desc" ? -1 : 1;

  const aggregation = [
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
      },
    },
    {
      $unwind: "$channelDetails",
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "channel",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscribers" },
      },
    },
    {
      $project: {
        _id: 0, // Don't return subscription _id
        channelId: "$channelDetails._id", // Channel's ID
        username: "$channelDetails.username", // Channel's username
        fullName: "$channelDetails.fullName", // Channel's full name
        avatar: "$channelDetails.avatar", // Channel's avatar
        subscriberCount: 1, // Include subscriber count
        subscribedAt: "$createdAt", // When user subscribed
      },
    },
    {
      $sort: { [sortBy]: sortOrder },
    },
  ];

  const pipeline = Subscription.aggregate(aggregation);

  const paginatedChannels = await Subscription.aggregatePaginate(
    pipeline,
    options,
  );

  if (!paginatedChannels) {
    throw new ApiError(500, "Failed to fetch subscribed channels");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        paginatedChannels,
        "Subscribed channels fetched successfully",
      ),
    );
});

export { toggleSubscription, getSubscribedChannels };
