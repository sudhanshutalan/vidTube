import { Router } from "express";
import {
  getSubscribedChannels,
  toggleSubscription,
} from "../controllers/subscriptions.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/subscribe/:channelId").post(toggleSubscription);

router.route("/my-subscriptions").get(getSubscribedChannels);

export default router;
