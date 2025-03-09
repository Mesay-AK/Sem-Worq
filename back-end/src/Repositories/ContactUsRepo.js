const ContactUsModel = require('../Infrastructures/models/ContactUsModel');

class contactRepository {
    async createContactUs(contactData) {
        try {
            const newMessage = new ContactUsModel(contactData);
            const savedMessage = await newMessage.save(); 
            return savedMessage; 
        } catch (err) {
            throw new Error('Failed to create contact message. Please check the provided data.');
        }
    }

    async getContactsUs (page, limit, sortOrder){
      try {
        const sort = sortOrder === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const messages = await ContactUsModel.find()
          .sort({"createdAt": sort})
          .skip(skip)
          .limit(limit)
          .exec();

        const totalItems = await ContactUsModel.countDocuments();

        return { messages, totalItems };
      } catch (err) {
        
        throw new Error('Error retrieving contact messages');
      }
    };

      async getContactById(messageId) {
        try {
            const contact = await ContactUsModel.findById(messageId);
            return contact;
        } catch (err) {
           
            throw new Error('Error retrieving contact message');
        }
    }

    async deleteContactUs(messageId) {
        try {
            const deletedMessage = await ContactUsModel.findByIdAndDelete(messageId);
            if (!deletedMessage) {
                throw new Error('Message not found'); 
                
            }
            return deletedMessage;
        } catch (err) {
            throw new Error(err.message || 'Error deleting the contact message');
        }
    }

}
module.exports = contactRepository;
