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

    const { page = 1, limit = 10, sortingOrder = 'desc' } = req.query;

    const validatedPage = Math.max(1, parseInt(page));
    const validatedLimit = Math.min(50, Math.max(1, parseInt(limit)));
    const validatedSortingOrder = sortingOrder === 'asc' ? 1 : -1; 

    const { contacts, totalPages, totalItems } = await contactUseCases.getContactsUseCase({
      page: validatedPage,
      limit: validatedLimit,
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
    const { id } = req.params;
    console.log("Received messageId:", id);

    // Validate `messageId` format and log the result
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ObjectId format for messageId:", id);
      return res.status(400).json({ message: 'Invalid message ID' });
    }


    const objectId = new mongoose.Types.ObjectId(id);
    console.log("Converted ObjectId:", objectId);

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


module.exports = { createContactController, getContactsController, deleteContactController}
