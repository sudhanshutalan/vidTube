import { Router } from "express";

import {
  deleteVideo,
  getAllUserVideos,
  getVideoById,
  publishAVideo,
  updateVideo,
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.use(verifyJWT);

// route for uploading a video
router.route("/publishVideo").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo,
);

//route for getting video by id
router.route("/:videoId").get(getVideoById);

//route for updating video
router.route("/:videoId").patch(
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateVideo,
);

//route for deleting the video
router.route("/:videoId").delete(deleteVideo);

//route for getting user specific videos
router.route("/user/:userId").get(getAllUserVideos);

export default router;
