import { Router } from "express";

import {
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

router.route("/:videoId").patch(
  upload.fields([
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateVideo,
);

export default router;
