const express = require("express");
const router = express.Router();

const user = require("../controller/user");
const data = require("../controller/data");
const account = require("../controller/account");

router.get("/", user.home);
router.get("/user-login", user.userLogedIn);// check if user is login
router.post("/user-data", user.readUserData);// send user data

// auth
router.post("/register", user.register);
router.post("/login", user.login);
router.post("/logout", user.logout);

// update account data
router.post("/data-account", account.updateAccount);
router.post("/data-account-photo", account.updateAccountPhoto);
router.post("/data-account-password", account.updateAccountPassword);
router.post("/data-account-close", account.closeAccount);

// add more data
router.post("/data-shared", data.postSharedData);
router.post("/data-likes", data.postLikesData);
router.post("/data-collection", data.postCollectionData);
router.post("/data-following", data.postFollowingData);

module.exports = router;