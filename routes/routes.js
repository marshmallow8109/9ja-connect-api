const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  GetUser,
  GetUserFriends,
  AddRemoveFriend,
  DeleteUser,
} = require("../controllers/controls");
const Auth = require("../middleware/auth");

//multer config
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//logins and register routes.
router.route("/register").post(upload.single("picture"), Register);
router.route("/login").post(Login);

//user routes, read routes
router.route("/users/:id", Auth).get(GetUser);
router.route("/users/:id/friends", Auth).get(GetUserFriends);
router.route("/users/:id/:friendId", Auth).patch(AddRemoveFriend);

//delete user, remove user
router.route("/users/:id").delete(Auth, DeleteUser);

module.exports = router;
