const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

// GET ALL USERS
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching users failed, try again", 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// USER SIGNUP
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(
      "Invalid inputs passed, please check your data",
      422
    );
    return next(error);
  }
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "Email already registered, proceed to login",
      422
    );
    return next(error);
  }

  const newUser = new User({
    name,
    email,
    image:
      "https://imageio.forbes.com/blogs-images/trevornace/files/2015/11/beautiful-places-world-1200x900.jpg",
    password,
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Signup failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

// USER LOGIN
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Login failed, please try again", 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials, could not login", 401);
    return next(error);
  }

  res.json({ message: "Logged in" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
