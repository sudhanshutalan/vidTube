import { Router } from "express";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  updatePlaylist,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
} from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);

// route for playlist creation
router.route("/").post(createPlaylist);

//route for get playlist by id
router.route("/:playlistId").get(getPlaylistById);

//route for playlist deletion
router.route("/:playlistId").delete(deletePlaylist);

// route for updating the playlist
router.route("/:playlistId").patch(updatePlaylist);

//route for get user's playlist by user _id
router.route("/user/:userId").get(getUserPlaylists);

//route for adding video to playlist
router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);

// route for removing video from playlist
router.route("/removee/:playlistId/:videoId").patch(removeVideoFromPlaylist);

export default router;
