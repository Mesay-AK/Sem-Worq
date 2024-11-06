// backend/src/domain/usecases/contactUseCases.js
const contactRepository = require('../adapters/Repositories/ContactUsRepo');
const ContactUsEntity = require('../Domain/ContactUsEntity');


const createContactUs = async (contactData) => {
  try {
    const contactEntity = new ContactUsEntity(contactData);
    contactEntity.validate(); 

    const newMessage = await contactRepository.createContactUs(contactData);
    return newMessage;
  } catch (err) {
    throw new Error(`Error submitting contact form: ${err.message}`);
  }
};

const getContactsUseCase = async ({ page, limit, sortBy, sortingOrder }) => {
  try {

    const skip = (page - 1) * limit;

    const {contacts, totalItems} = await contactRepository.getContactsUs(
      sortingOrder,
      skip ,
      limit)

    const totalPages = Math.ceil(totalItems / limit);

    return {
      contacts,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error in fetching contacts from the database');
  }
};

const deleteContactUsecase = async (messageId) => {
  try {
    const deletedMessage = await contactRepository.deleteContactUs(messageId);
    return deletedMessage; 
  } catch (err) {
    throw new Error('Error deleting message');
  }
};

module.exports = { createContactUs, getContactsUseCase, deleteContactUsecase };
