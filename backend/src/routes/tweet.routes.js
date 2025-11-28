import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controllers.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-tweet").post(createTweet);
router.route("/user/get-tweet/:userId").get(getUserTweets);
router.route("/update-tweet/:tweetId").patch(updateTweet);
router.route("/delete-tweet/:tweetId").delete(deleteTweet);

export default router;
