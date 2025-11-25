import { Router } from "express";
import {
  createPlaylist,
  getPlaylistById,
} from "../controllers/playlist.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createPlaylist);

router.route("/:playlistId").get(getPlaylistById);

export default router;
