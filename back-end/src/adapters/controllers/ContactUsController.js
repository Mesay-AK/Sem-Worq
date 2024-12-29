const mongoose = require('mongoose');
const ContactUsEntity = require('../../Domain/ContactUsEntity')

class ContactController {
    constructor(contactRepository) {
        this.contactRepository = contactRepository;

    }

    async createContact(req, res) {
        try {
            const { firstName, lastName, email, subject, message } = req.body;

            const contactEntity = new ContactUsEntity({ firstName, lastName, email, subject, message });
            contactEntity.validate(); 

            const newMessage = await this.contactRepository.createContactUs({ firstName, lastName, email, subject, message });

            res.status(201).json(newMessage);
        } catch (err) {
            res.status(400).json({ message: `Error: ${err.message}` });
        }
    }

    async getContacts(req, res) {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortingOrder = 'desc' } = req.query;

            const validatedPage = Math.max(1, parseInt(page));
            const validatedLimit = Math.min(50, Math.max(1, parseInt(limit)));
            const validatedSortingOrder = sortingOrder === 'asc' ? 1 : -1;

            const {contacts, totalItems} = await this.contactRepository.getContactsUs(
              {page: validatedPage,
              limit: validatedLimit ,
              sortingOrder:validatedSortingOrder})

            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).json({
                pagination: {
                    currentPage: validatedPage,
                    totalPages,
                    totalItems,
                    limit: validatedLimit,
                },
                data: { contacts },
            });
        } catch (error) {
            console.error('Error in getContacts:', error);
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }

    async deleteContact(req, res) {
        try {
            const { messageId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(messageId)) {
                return res.status(400).json({ message: 'Invalid message ID' });
            }

            const objectId = mongoose.Types.ObjectId(messageId);

            const deletedMessage = await this.contactRepository.deleteContactUs(objectId);

            if (!deletedMessage) {
                return res.status(404).json({ message: 'Message not found' });
            }

            res.status(200).json({ message: 'Message deleted successfully', deletedMessage });
        } catch (err) {
            console.error('Error in deleteContact:', err);
            res.status(500).json({ message: `Error: ${err.message}` });
        }
    }

    async getContactById(req, res) {
        try {
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid message ID' });
            }

            const contact = await this.contactRepository.getContactById(id);

            if (!contact) {
                return res.status(404).json({ message: 'Contact not found' });
            }

            res.status(200).json(contact);
        } catch (err) {
            console.error('Error in getContactById:', err);
            res.status(500).json({ message: `Error: ${err.message}` });
        }
    }
}

module.exports = ContactController;
