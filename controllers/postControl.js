const asyncWrapper = require("../middleware/asyncWrapper");
const Post = require("../model/post");
const User = require("../model/Users");

//create post
const AddPost = asyncWrapper(async (req, res) => {
  const { userId, description, picturePath } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ msg: "No user found, cant create post" });
    return;
  }
  //create and save post object
  const newPost = new Post({
    userId,
    firstName: user.firstName,
    lastName: user.lastName,
    city: user.city,
    description,
    picturePath,
    userPicturePath: user.picturePath,
    likes: {},
    comments: [],
  });
  await newPost.save();

  const post = await Post.find().sort({ createdAt: -1 });
  res.status(201).json(post);
});

// delete post me added
const DeletePost = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await Post.findOneAndDelete(id);

  const post = Post.find().sort();
  if (!post) {
    res.status(200).json({ msg: "You currently have no post" });
    return;
  }
  res.status(200).json(post);
});

//get all feeds post
const GetFeedPosts = asyncWrapper(async (req, res) => {
  const post = await Post.find().sort();
  if (!post) {
    res.status(404).json({ msg: "No post found yet" });
    return;
  }
  res.status(200).json(post);
});

const GetUserPost = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  const post = await Post.find({ userId }).sort();
  if (!post) {
    return res.status(200).json({ msg: "you dont have a post yet" });
  }
  res.status(200).json(post);
});

const LikePost = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const post = await Post.findById(id);
  const isLiked = post.likes.get(userId);

  if (isLiked) {
    post.likes.delete(userId);
  } else {
    post.likes.set(userId, true);
  }

  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { likes: post.likes },
    { new: true }
  );

  res.status(200).json(updatedPost);
});

module.exports = { AddPost, DeletePost, GetUserPost, GetFeedPosts, LikePost };
