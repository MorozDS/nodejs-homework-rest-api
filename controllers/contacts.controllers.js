const { Contact } = require("../models/contacts");

const { HttpError, tryCatchWrapper } = require("../helpers/index");

async function getContacts(req, res, next) {
  const contacts = await Contact.find({});
  res.status(200).json(contacts);
}

async function getContact(req, res, next) {
  const { id } = req.params;
  const contacts = await Contact.findById(id);
  if (!contacts) {
    return next(HttpError(404, "Not found"));
  }
  return res.status(200).json(contacts);
}

async function createContact(req, res, next) {
  const { name, email, phone, favorite } = req.body;
  const newContact = await Contact.create({ name, email, phone, favorite });
  res.status(201).json(newContact);
}

async function deleteContact(req, res, next) {
  const { id } = req.params;
  const contact = await Contact.findById(id);
  if (!contact) {
    return next(HttpError(404, "Not found"));
  }
  await Contact.findByIdAndRemove(id);
  return res.status(200).json({ message: "contact deleted" });
}

async function updateContacts(req, res, next) {
  const { id } = req.params;
  const { name, email, phone, favorite } = req.body;

  const update = await Contact.findByIdAndUpdate(
    { _id: id },
    {
      name,
      email,
      phone,
      favorite,
    },
    { new: true }
  );
  res.json(update);
}

async function updateStatusContact(req, res, next) {
  const { id } = req.params;
  const { favorite } = req.body;

  if (!favorite) {
    return next(HttpError(400, "missing field favorite"));
  }
  const updateStatus = await Contact.findByIdAndUpdate(
    { _id: id },
    { favorite }
  );
  res.status(200).json(updateStatus);
}

module.exports = {
  getContact,
  getContacts,
  deleteContact,
  createContact,
  updateContacts,
  updateStatusContact,
};
