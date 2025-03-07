// contactRepository.test.js
const ContactUsModel = require('../../Infrastructures/models/ContactUsModel');
const ContactRepository = require('../../Repositories/ContactUsRepo');

// Mock the ContactUsModel methods
jest.mock('../../Infrastructures/models/ContactUsModel');

describe('contactRepository', () => {
    let contactRepository;

    beforeEach(() => {
        contactRepository = new ContactRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for createContactUs method
    describe('createContactUs', () => {
        it('should successfully save a new contact message', async () => {
            const contactData = { name: 'John Doe', email: 'johndoe@example.com', message: 'Hello there!' };
            const mockSavedMessage = { _id: '123', ...contactData };

            // Simulate save operation
            ContactUsModel.prototype.save.mockResolvedValue(mockSavedMessage);

            const result = await contactRepository.createContactUs(contactData);

            expect(result).toEqual(mockSavedMessage);
            expect(ContactUsModel.prototype.save).toHaveBeenCalled();
        });

        it('should throw error if save fails', async () => {
            const contactData = { name: 'John Doe', email: 'johndoe@example.com', message: 'Hello there!' };

            // Simulate save failure
            ContactUsModel.prototype.save.mockRejectedValue(new Error('Save failed'));

            await expect(contactRepository.createContactUs(contactData))
                .rejects
                .toThrow('Error saving the contact message');
        });
    });

    // Test for getContactsUs method
    describe('getContactsUs', () => {
        it('should return messages with pagination and sorting', async () => {
            const page = 1;
            const limit = 10;
            const sortOrder = 'desc';
            const mockMessages = [{ _id: '123', name: 'John Doe', email: 'johndoe@example.com', message: 'Hello!' }];
            const totalItems = 1;

            // Simulate find and countDocuments operations
            ContactUsModel.find.mockResolvedValue(mockMessages);
            ContactUsModel.countDocuments.mockResolvedValue(totalItems);

            const result = await contactRepository.getContactsUs(page, limit, sortOrder);

            expect(result.messages).toEqual(mockMessages);
            expect(result.totalItems).toBe(totalItems);
            expect(ContactUsModel.find).toHaveBeenCalledWith(expect.objectContaining({}));
            expect(ContactUsModel.countDocuments).toHaveBeenCalled();
        });

        it('should throw error if retrieving messages fails', async () => {
            const page = 1;
            const limit = 10;
            const sortOrder = 'desc';

            // Simulate failure of find and countDocuments
            ContactUsModel.find.mockRejectedValue(new Error('Find failed'));
            ContactUsModel.countDocuments.mockRejectedValue(new Error('Count failed'));

            await expect(contactRepository.getContactsUs(page, limit, sortOrder))
                .rejects
                .toThrow('Error retrieving contact messages');
        });
    });

    // Test for deleteContactUs method
    describe('deleteContactUs', () => {
        it('should successfully delete a contact message', async () => {
            const messageId = '123';
            const mockDeletedMessage = { _id: '123', name: 'John Doe', email: 'johndoe@example.com', message: 'Hello there!' };

            // Simulate findByIdAndDelete operation
            ContactUsModel.findByIdAndDelete.mockResolvedValue(mockDeletedMessage);

            const result = await contactRepository.deleteContactUs(messageId);

            expect(result).toEqual(mockDeletedMessage);
            expect(ContactUsModel.findByIdAndDelete).toHaveBeenCalledWith(messageId);
        });

        it('should throw error if message is not found', async () => {
            const messageId = '123';

            // Simulate message not being found
            ContactUsModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(contactRepository.deleteContactUs(messageId))
                .rejects
                .toThrow('Message not found');
        });

        it('should throw error if delete operation fails', async () => {
            const messageId = '123';

            // Simulate failure of findByIdAndDelete
            ContactUsModel.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

            await expect(contactRepository.deleteContactUs(messageId))
                .rejects
                .toThrow('Error deleting the contact message');
        });
    });
});
