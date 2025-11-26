import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.models.js";
import { Video } from "../models/video.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// playlist creation
const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  //TODO: create playlist
  if (!name || !description) {
    throw new ApiError(404, "playlist name and description is required");
  }

  const playlist = await Playlist.create({
    playlistName: name,
    description: description,
    owner: req.user?._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: playlist }, "Playlist created successfully"),
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const userPlaylist = await Playlist.find({ owner: userId });

  if (!userPlaylist) {
    throw new ApiError(400, "user playlists not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: userPlaylist },
        "User playlists fetched successfully",
      ),
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (!playlist) {
    throw new ApiError(400, "playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: playlist }, "Playlist fetched successfully"),
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid playlistId and videoId");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "video not found");
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    {
      $addToSet: { videos: new ObjectId(videoId) },
    },
    { new: true },
  );

  if (!playlist) {
    throw new ApiError(400, "playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: playlist },
        "video added to playlist successfully",
      ),
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "invalid videoid or playlistId");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video not found");
  }

  const playlist = await Playlist.findByIdAndDelete(
    playlistId,
    {
      $pull: { videos: new ObjectId(videoId) },
    },
    { new: true },
  );

  if (!playlist) {
    throw new ApiError(400, "playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200),
      { data: playlist },
      "video deleted form playlist successfully",
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist id");
  }

  const deletePlaylist = await Playlist.findByIdAndDelete(playlistId);

  if (!deletePlaylist) {
    throw new ApiError(400, "no playlist found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { data: deletePlaylist },
        "playlist deleted successfully",
      ),
    );
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist");
  }

  if (!name || !description) {
    throw new ApiError(400, "description and name is required");
  }

  const playlist = Playlist.findByIdAndUpdate(
    playlistId,
    {
      $set: {
        playlistName: name,
        description: description,
      },
    },
    { new: true },
  );

  if (!playlist) {
    throw new ApiError(400, "playlist not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { data: playlist }, "playlist updated successfully"),
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
