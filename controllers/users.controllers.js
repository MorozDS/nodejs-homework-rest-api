const { User } = require("../models/users");
const { Conflict, Unauthorized, NotFound } = require("http-errors");
const { sendMail } = require("../helpers/index");
const path = require("path");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
// const { path } = require("../app");
dotenv.config();

const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password } = req.body;
  const imageUrl = await gravatar.url(email);
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const verificationToken = nanoid();
    const savedUser = await User.create({
      email,
      avatarUrl: imageUrl,
      password: hashedPassword,
      verificationToken,
    });
    console.log(savedUser);

    await sendMail({
      to: email,
      subject: "Please confirm your email",
      html: `<a href="localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
      text: `<a href="localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
    });

    res.status(201).json({
      user: {
        email,
        avatarUrl: imageUrl,
        id: savedUser._id,
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw Conflict("Email in use");
    }
  }
}

async function login(req, res, next) {
  const { email, password, avatarUrl } = req.body;
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
      avatarUrl,
      subscription: "starter",
    },
  });
}

async function logout(req, res, next) {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: null });
  return res.status(204).json({
    _id,
  });
}

async function currentUser(req, res, next) {
  const { user } = req;
  const { email, _id: id, subscription } = user;

  return res.status(200).json({
    user: {
      id,
      email,
      subscription,
    },
  });
}

async function updateUserSubscription(req, res, next) {
  const { id } = req.params;
  const { subscription } = req.body;
  console.log(id);

  const updateSubscription = await User.findByIdAndUpdate(
    { _id: id },
    { subscription }
  );
  res.status(200).json(updateSubscription);
}

async function updateAvatar(req, res, next) {
  const { filename } = req.file;
  const { _id: id } = req.user;
  const imageName = `${id}_${filename}`;
  const tmpPath = path.resolve(__dirname, "../", "temp", filename);

  const image = await Jimp.read(tmpPath);
  await image.resize(250, 250);
  await image.writeAsync(tmpPath);

  const newPath = path.resolve(
    __dirname,
    "../",
    "public",
    "avatars",
    imageName
  );

  try {
    await fs.rename(tmpPath, newPath);
    const avatarUrl = path.join("avatars", imageName);
    await User.findByIdAndUpdate(id, { avatarUrl });
    return res.status(200).json({
      avatarUrl,
    });
  } catch (error) {
    console.error("error while moving file to public", error);
    return res.status(401).json({
      message: "Not authorized",
    });
  }
}

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  const user = await User.findOne({
    verificationToken: verificationToken,
  });

  if (!user) {
    throw NotFound("User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  return res.status(200).json({
    message: "Verification successful",
  });
}

module.exports = {
  register,
  login,
  logout,
  currentUser,
  updateUserSubscription,
  updateAvatar,
  verifyEmail,
};
