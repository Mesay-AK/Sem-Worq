const contactRepository = require('../../Repositories/ContactUsRepo');
const ContactUsModel = require('../../Infrastructures/models/ContactUsModel');


jest.mock('../../Infrastructures/models/ContactUsModel');

describe('Contact Repository', () => {
    let repo;

    beforeEach(() => {
        repo = new contactRepository();
        jest.clearAllMocks();
    });

    describe('createContactUs', () => {
        it('should create and return a new contact message', async () => {
            const contactData = { firstName: 'John', lastName: 'Doe', email: 'john@example.com', subject: 'Hello', message: 'Test message' };
            const savedMessage = { ...contactData, _id: '123' };

            ContactUsModel.prototype.save.mockResolvedValue(savedMessage);

            const result = await repo.createContactUs(contactData);
            expect(result).toEqual(savedMessage);
        });

        it('should throw an error if saving fails', async () => {
            ContactUsModel.prototype.save.mockRejectedValue(new Error('DB Error'));

            await expect(repo.createContactUs({})).rejects.toThrow('Failed to create contact message. Please check the provided data.');
        });
    });

    describe('getContactsUs', () => {
        it('should return paginated contacts', async () => {
            const contacts = [{ _id: '123', message: 'Test message' }];
            ContactUsModel.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([{ _id: '123', message: 'Test message' }])
            });
            ContactUsModel.countDocuments.mockResolvedValue(1);

            const result = await repo.getContactsUs(1, 10, 'desc');
            expect(result).toEqual({ messages: contacts, totalItems: 1 });
        });

        it('should throw an error if retrieval fails', async () => {
            ContactUsModel.find.mockImplementation(() => { throw new Error('DB Error'); });

            await expect(repo.getContactsUs(1, 10, 'desc')).rejects.toThrow('Error retrieving contact messages');
        });
    });

    describe('getContactById', () => {
        it('should return a contact if found', async () => {
            const contact = { _id: '123', message: 'Test message' };
            ContactUsModel.findById.mockResolvedValue(contact);

            const result = await repo.getContactById('123');
            expect(result).toEqual(contact);
        });

        it('should return null if no contact is found', async () => {
            ContactUsModel.findById.mockResolvedValue(null);

            const result = await repo.getContactById('123');
            expect(result).toBeNull();
        });

        it('should throw an error if retrieval fails', async () => {
            ContactUsModel.findById.mockRejectedValue(new Error('DB Error'));

            await expect(repo.getContactById('123')).rejects.toThrow('Error retrieving contact message');
        });
    });

    describe('deleteContactUs', () => {
        it('should delete a contact if found', async () => {
            const deletedMessage = { _id: '123', message: 'Test message' };
            ContactUsModel.findByIdAndDelete.mockResolvedValue(deletedMessage);

            const result = await repo.deleteContactUs('123');
            expect(result).toEqual(deletedMessage);
        });

        it('should throw an error if the contact is not found', async () => {
            ContactUsModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(repo.deleteContactUs('123')).rejects.toThrow('Message not found');
        });

    });
});
