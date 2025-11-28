import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  getlikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLIke,
} from "../controllers/likes.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/video/:videoId").post(toggleVideoLIke);
router.route("/comment/:commentId").post(toggleCommentLike);
router.route("/tweet/:tweetId").post(toggleTweetLike);
router.route("/likedVideos").get(getlikedVideos);

export default router;
