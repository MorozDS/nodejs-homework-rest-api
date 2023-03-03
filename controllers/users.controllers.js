const { User } = require("../models/users");
const { Conflict, Unauthorized } = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      user: {
        email,
        id: savedUser._id,
        subscription: "starter",
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw Conflict("Email in use");
    }
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const storedUser = await User.findOne({ email });
  const isPasswordValid = await bcrypt.compare(password, storedUser.password);

  if (!storedUser || !isPasswordValid) {
    throw Unauthorized("Email or password is wrong");
  }

  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  await User.findByIdAndUpdate(storedUser._id, { token });

  return res.status(200).json({
    token,
    user: {
      email,
      subscription: "starter",
    },
  });
}

async function logout(req, res, next) {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204);
}

async function currentUser(req, res, next) {
  const { user } = req;
  const { email, _id: id } = user;

  return res.status(200).json({
    user: {
      email,
      subscription,
    },
  });
}

module.exports = {
  register,
  login,
  logout,
  currentUser,
};
