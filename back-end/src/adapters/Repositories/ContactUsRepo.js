const ContactUsModel = require('../models/ContactUsModel');
class ContactRepository {
    async createContactUs(contactData) {
      try {
        const newMessage = new ContactUsModel(contactData);
        await newMessage.save();
        return newMessage;
      } catch (err) {
        console.error('Error saving message:', err);
        throw new Error('Error saving the contact message');
      }
    }

    async getContactsUs(page, limit, sortOrder) {
      try {
        const sort = sortOrder === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const messages = await ContactUsModel
          .find()
          .sort({ createdAt: sort })
          .skip(skip)
          .limit(limit)
          .exec();

        const totalItems = await ContactUsModel.countDocuments();

        return { messages, totalItems };
      } catch (err) {
        console.error('Error retrieving messages:', err);
        throw new Error('Error retrieving contact messages');
      }
    }

    async deleteContactUs(messageId) {
      try {
        const message = await ContactUsModel.findById(messageId);
        if (!message) {
          console.log("Message not found for deletion:", messageId);
          throw new Error('Message not found');
        }

        const deletedMessage = await ContactUsModel.findByIdAndDelete(messageId);
        return deletedMessage;
      } catch (err) {
        console.error('Error deleting message in repo:', err);
        throw new Error('Error deleting the contact message');
      }
    }

    async getContactById(id){
      try {
        const message = await ContactUsModel.findById(id);
        if (!message) {
          console.log("Message not found for deletion:", id);
          throw new Error('Message not found');
        }
      }catch(err){
          console.error("Error finding contact: ", err);
          throw new Error("Error finding contact by Id")
      }
    }
  }

module.exports = ContactRepository;
