import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-comment/:videoId").post(createComment);
router.route("/update-comment/:videoId/:commentId").patch(updateComment);
router.route("/delete-comment/:videoId/:commentId").delete(deleteComment);
router.route("/video-comments/:videoId").get(getVideoComments);

export default router;
