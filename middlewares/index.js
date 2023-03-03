const { HttpError } = require("../helpers/index");
const { jwt } = require("jsonwebtoken");
const { Unauthorized } = require("http-errors");
const { User } = require("../models/users");

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

async function auth(res, req, next) {
  const { authorization = "" } = req.headers;
  // const authHeader = req.headers.authorization || "";
  const [type, token] = authorization.split(" ");

  if (!token || type !== "Bearer") {
    throw Unauthorized("Not authorized");
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw Unauthorized("jwt token is not valid");
    }
    if (!id) {
      throw Unauthorized(" User id not find");
    }
  }
  next();
}
module.exports = {
  validateBody,
  auth,
};
