const express = require("express");
const { tryCatchWrapper, auth } = require("../../helpers/index");
const {
  login,
  register,
  currentUser,
} = require("../../controllers/users.controllers");

const userRouter = express.Router();

userRouter.post("/signup", tryCatchWrapper(register));
userRouter.post("/login", tryCatchWrapper(login));
userRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser));

module.exports = userRouter;
