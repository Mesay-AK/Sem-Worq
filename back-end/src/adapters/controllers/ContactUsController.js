// backend/src/controllers/contactController.js
const contactUseCases = require('../../Usecases/ContactUsUsecase');
const mongoose = require('mongoose');



const createContactController= async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;
    const newMessage = await contactUseCases.createContactUs({ firstName, lastName, email, subject, message });
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  }
};

const getContactsController = async (req, res) => {
  try {

    const { page = 1, limit = 10, sortBy = 'createdAt', sortingOrder = 'desc' } = req.query;

    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.min(50, Math.max(1, parseInt(limit)));
    const validatedSortingOrder = sortingOrder === 'asc' ? 1 : -1; 

    const { contacts, totalPages, totalItems } = await contactUseCases.getContactsUseCase({
      page: validatedPage,
      limit: validatedLimit,
      sortBy,
      sortingOrder: validatedSortingOrder,
    });
console.log(contacts)
res.status(200).json({
  pagination: {
    currentPage: validatedPage,
    totalPages,
    totalItems,
    limit: validatedLimit,
  },
  data: {contacts}
});
  } catch (error) {
    console.log(error)
  }
}
const deleteContactController = async (req, res) => {
  try {
    const { messageId } = req.params;
    console.log("Received messageId:", messageId);

    // Validate `messageId` format and log the result
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      console.error("Invalid ObjectId format for messageId:", messageId);
      return res.status(400).json({ message: 'Invalid message ID' });
    }

    // Convert `messageId` to ObjectId type
    const objectId = mongoose.Types.ObjectId(messageId);
    console.log("Converted ObjectId:", objectId);

    // Use `objectId` in the query to delete
    const deletedMessage = await contactUseCases.deleteContactUsecase(objectId);

    if (!deletedMessage) {
      console.log("Document with messageId not found:", messageId);
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(200).json({ message: 'Message deleted successfully', deletedMessage });
  } catch (err) {
    console.error('Error in deleteContactController:', err);
    res.status(500).json({ message: `Error: ${err.message}` });
  }
};

const getContactByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received contact ID:", id);

    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }

    // Convert to ObjectId type
    const contactId = mongoose.Types.ObjectId(id);

    // Find the contactUs by ID
    const contact = await ContactUsModel.findById(contactId);

    // If no contact is found with the provided ID
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    // If contact is found, return the contact
    res.status(200).json(contact);
  } catch (err) {
    console.error('Error in getContactByIdController:', err);
    res.status(500).json({ message: `Error: ${err.message}` });
  }
};


module.exports = { createContactController, getContactsController, deleteContactController,getContactByIdController}
