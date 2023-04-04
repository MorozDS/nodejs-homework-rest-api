const dotenv = require("dotenv");
const sendGrid = require("@sendgrid/mail");

dotenv.config();

const { API_KEY_SENDGRID } = process.env;

function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

function HttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function sendMail({ to, html, subject, text }) {
  try {
    sendGrid.setApiKey(API_KEY_SENDGRID);
    const email = {
      from: "morozddima@gmail.com",
      to,
      subject,
      html,
      text,
    };
    await sendGrid.send(email);
  } catch (error) {
    console.error("App error:", error);
  }
}

module.exports = {
  tryCatchWrapper,
  HttpError,
  sendMail,
};
