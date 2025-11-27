import { Mongoose, isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.models.js";
import { User } from "../models/users.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

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

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { data: video }, "video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid Id");
  }

  const video = await Video.findById(videoId);
  const oldThumbnailurl = video.thumbnail;

  console.log(oldThumbnailurl);

  if (!title || !description) {
    throw new ApiError(400, "title and description is required");
  }

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!thumbnailLocalPath) {
    throw new ApiError(400, "thumbnail file is missing");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: thumbnail.url,
      },
    },
    { new: true },
  );

  if (oldThumbnailurl) {
    const parts = oldThumbnailurl.split("/");
    const publicId = parts[parts.length - 1].split(".")[0];
    console.log(publicId);
    await deleteFromCloudinary(publicId);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: updatedVideo },
        "video updated successfully",
      ),
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video Id");
  }

  try {
    const deletedVideo = await Video.findByIdAndDelete(videoId);

    if (!deletedVideo) {
      throw new ApiError(400, "Video doesnot exist");
    }
    // deleting thumbnail
    const thumbnailurl = deletedVideo.thumbnail;
    console.log("thumbnail", thumbnailurl);
    const thumbnailParts = thumbnailurl.split("/");
    console.log("thumbnail", thumbnailParts);
    const thumbnailPublicId =
      thumbnailParts[thumbnailParts.length - 1].split(".")[0];

    console.log("thumbnail", thumbnailPublicId);

    await deleteFromCloudinary(thumbnailPublicId);

    // deleting video
    const videoFileurl = deletedVideo.videoFile;
    console.log("videoFile", videoFileurl);
    const videoFileParts = videoFileurl.split("/");
    console.log("videoFile", videoFileParts);
    const videoFilePublicId =
      videoFileParts[videoFileParts.length - 1].split(".")[0];
    console.log("videoFile", videoFilePublicId);

    await deleteFromCloudinary(videoFilePublicId, "video");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { data: deletedVideo },
          "video deleted successfully",
        ),
      );
  } catch (error) {
    console.log("error in deleting video", error);
    throw new ApiError(500, "Failed to delete Video", error);
  }
});

const getAllUserVideos = asyncHandler(async (req, res) => {
  // const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
  //TODO: get all videos based on query, sort, pagination

  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }

  const userVideos = await Video.find({ owner: userId }).select(
    " -createdAt -updatedAt",
  );

  if (!userVideos) {
    throw new ApiError("User videos not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: userVideos },
        "user videos detched successfully",
      ),
    );
});

export {
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getAllUserVideos,
};
