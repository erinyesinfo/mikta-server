const express = require("express");
const router = express.Router();

const user = require("../controller/user");
const profile = require("../controller/profile");
const followings = require("../controller/followings");
const likes = require("../controller/likes");
const shared = require("../controller/shared");
const collections = require("../controller/collections");
const data = require("../controller/data");

router.get("/", user.home);
router.get("/auth", user.userLogedIn);// check if user is login

/* Authentication */
router.post("/register", user.register);
router.post("/login", user.login);
router.post("/logout", user.logout);

/* Read user profile data */
router.get("/profile", profile.ReadUserProfileController);

/* Update user profile data */
router.post("/profile", profile.UpdateUserProfileController);
router.post("/profile/photo", profile.UpdateUserProfilePhotoController);
router.post("/profile/password", profile.UpdateUserProfilePasswordController);
router.post("/close-account", profile.CloseAccountController);

/* Update followings, likes, shared, collections data */
router.post("/followings", followings.UpdateFollowingsDataController);
router.post("/shared", shared.UpdateSharedDataController);
router.post("/likes", likes.UpdateLikesDataController);
router.post("/collections", collections.UpdateCollectionsDataController);

/* Read followings, likes, shared, collections data */
router.get("/followings", followings.ReadUserFollowingsDataController);
router.get("/shared", shared.ReadUserSharedDataController);
router.get("/likes", likes.ReadUserLikesDataController);
router.get("/collections", collections.ReadUserCollectionsDataController);
/* Read length of(followings, likes, shared, collections) data */
router.get("/length", data.ReadHomeDataLengthController);

module.exports = router;