const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index");
const { auth } = require("../../middlewares/index.js");
const {
  login,
  register,
  logout,
  currentUser,
} = require("../../controllers/users.controllers");

const userRouter = express.Router();

userRouter.post("/signup", tryCatchWrapper(register));
userRouter.post("/login", tryCatchWrapper(login));
userRouter.get("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));
userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser));

module.exports = userRouter;
