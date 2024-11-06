const ContactUsModel = require('../models/ContactUsModel');

const createContactUs = async (contactData) => {
  try {
    const newMessage = new ContactUsModel(contactData);
    await newMessage.save();
    return newMessage; 
  } catch (err) {
    console.error('Error saving message:', err);
    throw new Error('Error saving the contact message');
  }
};


const getContactsUs = async (page, limit, sortOrder) => {
  try {
    const sort = sortOrder === 'desc' ? -1 : 1;
    const messages = await ContactUsModel.find()
      .sort({"createdAt": sort})
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalItems = await ContactUsModel.countDocuments();

    return { messages, totalItems };
  } catch (err) {
    console.error('Error retrieving messages:', err);
    throw new Error('Error retrieving contact messages');
  }
};

const deleteContactUs = async (messageId) => {
  try {
    const deletedMessage = await ContactUsModel.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      throw new Error('Message not found');
    }
    return deletedMessage;
  } catch (err) {
    console.error('Error deleting message:', err);
    throw new Error('Error deleting the contact message');
  }
};

module.exports = { createContactUs, getContactsUs, deleteContactUs };
