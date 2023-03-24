const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index");
const { auth, upload } = require("../../middlewares/index.js");
const {
  login,
  register,
  logout,
  currentUser,
  updateUserSubscription,
  updateAvatar,
} = require("../../controllers/users.controllers");

const userRouter = express.Router();

userRouter.post("/signup", tryCatchWrapper(register));
userRouter.post("/login", tryCatchWrapper(login));
userRouter.get("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));
userRouter.get("/current", auth, tryCatchWrapper(currentUser));
userRouter.patch("/:id", tryCatchWrapper(updateUserSubscription));
userRouter.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  tryCatchWrapper(updateAvatar)
);

module.exports = userRouter;
