const { HttpError } = require("../helpers/index");
const jwt = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");
const { User } = require("../models/users");
const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(HttpError(400, error.message));
    }

    return next();
  };
}

async function auth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  try {
    if (type !== "Bearer") {
      throw HttpError(401, "token type is not valid");
    }

    if (!token) {
      throw HttpError(401, "no token provided");
    }
    const { id } = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(id);
    if (!user) {
      throw Unauthorized("User id not find");
    }
    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw Unauthorized("jwt token is not valid");
    }
    throw error;
  }
  next();
}
module.exports = {
  validateBody,
  auth,
};
