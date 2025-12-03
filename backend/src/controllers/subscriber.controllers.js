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

export { toggleSubscription };
