import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.models.js";
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

  res.status(200).json({
    success: true,
    data: playlist,
    message: "Playlist created successfully",
  });
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  //TODO: get user
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const userPlaylist = await Playlist.find({ owner: userId });

  return res.status(200).json({
    success: true,
    data: userPlaylist,
    message: "User playlists fetched successfully",
  });
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "invalid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);

  return res.status(200).json({
    success: true,
    data: playlist,
    message: "Playlist fetched successfully",
  });
});

export { createPlaylist, getUserPlaylists, getPlaylistById };
