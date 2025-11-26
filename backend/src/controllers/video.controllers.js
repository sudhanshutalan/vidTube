import { Mongoose, isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "title and description is required");
  }

  // 1. Get file paths from req.files (not req.file)
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail file is missing");
  }

  if (!videoLocalPath) {
    throw new ApiError(400, "video file is missing");
  }

  // 2. Upload to Cloudinary
  // Note: We declare these outside so we can use them later
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  const videoFile = await uploadOnCloudinary(videoLocalPath);

  if (!thumbnail) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  if (!videoFile) {
    throw new ApiError(500, "Failed to upload video");
  }

  // 3. Create Video Entry in DB
  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnail.url,
    videoFile: videoFile.url,
    owner: req.user?._id,
    duration: videoFile.duration, // Cloudinary gives us the duration!
    views: 0,
    isPublished: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video published successfully"));
});

export { publishAVideo };
