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

    const {messages, totalItems} = await contactRepository.getContactsUs(
      page,
      limit ,
      sortingOrder)

    const totalPages = Math.ceil(totalItems / limit);

    return {
      contacts:messages,
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error(error);
    throw new Error('Error in fetching contacts from the database');
  }
};

const deleteContactUsecase = async (messageId) => {
  const objectId = mongoose.Types.ObjectId(messageId);
  try {
    const deletedMessage = await contactRepository.deleteContactUs(objectId);
    return deletedMessage; 
  } catch (err) {
    console.log("Error in deleteContactUsecase")
    throw new Error('Error in message');
  }
};

module.exports = { createContactUs, getContactsUseCase, deleteContactUsecase };
