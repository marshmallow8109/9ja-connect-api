const asyncWrapper = require("../middleware/asyncWrapper");
const User = require("../model/Users");
const bcypt = require("bcryptjs");

//Register controller
const Register = asyncWrapper(async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(201).json({ user: { userInfo: user, token: token } });
});

//login controller
const Login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      msg: `Provide email and password to login`,
    });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({ msg: `no user with email: ${email} not found` });
    return;
  }
  const isPasswordCorrect = await user.comparePassword(password);

  // const passCheck = await bcypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(401).json({ msg: `invalid credentials` });
    return;
  }
  const token = await user.createJWT();
  res.status(200).send({ token, user });
});

//get User controllers
const GetUser = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  delete user.password;
  //add code for delete password here
  if (!user) {
    return res.status(404).json({ msg: "No user found" });
  }
  res.status(200).json(user);
});

//get User frinds controllers
const GetUserFriends = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ msg: "user not found!" });
  }

  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );
  const formattedData = friends.map(
    ({ _id, firstName, lastName, occupation, city, picturePath }) => {
      return { _id, firstName, lastName, occupation, city, picturePath };
    }
  );
  res.status(200).json(formattedData);
});

// Add User/remove user controllers
const AddRemoveFriend = asyncWrapper(async (req, res) => {
  const { id, friendId } = req.params;
  const user = await User.findById(id);
  const friend = await User.findById(friendId);
  if (!user || !friend) {
    return res.status(500).json({ msg: "cannot add or remove friends" });
  }

  if (user.friends.includes(friendId)) {
    user.friends = user.friends.filter((id) => id !== friendId);
    friend.friends = friend.friends.filter((id) => id !== id);
  } else {
    user.friends.push(friendId);
    friend.friends.push(id);
  }
  await user.save();
  await friend.save();

  //format friend list for frontend Optional
  const friends = await Promise.all(
    user.friends.map((id) => User.findById(id))
  );
  const formatted = friends.map(
    ({ _id, firstname, lastname, occupation, city, picturePath }) => {
      return { _id, firstname, lastname, occupation, city, picturePath };
    }
  );
  res.status(200).json(formatted);
});

const DeleteUser = asyncWrapper(async (req, res) => {
  console.log("delete user");
  res.status(200).send("delete route");
});

module.exports = {
  Register,
  Login,
  GetUser,
  GetUserFriends,
  AddRemoveFriend,
  DeleteUser,
};
