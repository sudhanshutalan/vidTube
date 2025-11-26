import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

//routes

// register user route
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

//login user route
router.route("/login").post(loginUser);

//logout user
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);

export default router;
