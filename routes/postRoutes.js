const multer = require("multer");
const express = require("express");
const router = express.Router();
const {
  AddPost,
  DeletePost,
  GetFeedPosts,
  GetUserPost,
  LikePost,
} = require("../controllers/postControl");
const Auth = require("../middleware/auth");

// multa config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

//

router.route("/post", Auth).post(upload.single("picture"), AddPost);
//delete post my added
router.route("/post/:id").delete(DeletePost);

router.route("/post/feeds", Auth).get(GetFeedPosts);
router.route("/post/:userId/post", Auth).get(GetUserPost);
router.route("/:id/like", Auth).patch(LikePost);

module.exports = router;
