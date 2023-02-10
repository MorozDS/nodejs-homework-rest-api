const express = require("express");
const {
  getContact,
  getContacts,
  deleteContact,
  createContact,
  updateContacts,
  updateStatusContact,
} = require("../../controllers/contacts.controllers");
const { validateBody } = require("../../middlewares/index");
const { tryCatchWrapper } = require("../../helpers/index");
const { addContactSchema } = require("../../schemas/contacts");

const contactsRouter = express.Router();

contactsRouter.get("/", tryCatchWrapper(getContacts));

contactsRouter.get("/:id", tryCatchWrapper(getContact));

contactsRouter.post(
  "/",
  validateBody(addContactSchema),
  tryCatchWrapper(createContact)
);

contactsRouter.delete("/:id", tryCatchWrapper(deleteContact));

contactsRouter.put(
  "/:id",
  validateBody(addContactSchema),
  tryCatchWrapper(updateContacts)
);

contactsRouter.patch("/:id/favorite", tryCatchWrapper(updateStatusContact));

module.exports = contactsRouter;
