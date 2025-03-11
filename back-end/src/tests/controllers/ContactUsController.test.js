const ContactController = require('../../adapters/controllers/ContactUsController');
const ContactUsEntity = require('../../Domain/ContactUsEntity');

describe('ContactController Tests', () => {
    let contactRepository, controller, req, res;

    beforeEach(() => {
        contactRepository = {
            createContactUs: jest.fn(),
            getContactsUs: jest.fn(),
            deleteContactUs: jest.fn(),
            getContactById: jest.fn()
        };
        
        controller = new ContactController(contactRepository);

        req = { body: {}, params: {}, query: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('createContact', () => {
        it('should return 400 if required fields are missing', async () => {
            req.body = { firstName: "", lastName: "", email: "", subject: "", message: "" };

            await controller.createContact(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "All fields are required." });
        });

        it('should return 201 if contact is successfully created', async () => {
            req.body = {
                firstName: "John",
                lastName: "Doe",
                email: "john@example.com",
                subject: "Inquiry",
                message: "Hello, I have a question."
            };

            const mockContact = { ...req.body, id: "12345" };
            contactRepository.createContactUs.mockResolvedValue(mockContact);

            await controller.createContact(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockContact);
        });

        it('should return 400 if validation fails', async () => {
            req.body = { firstName: "John", lastName: "Doe", email: "invalid-email", subject: "Test", message: "Hi" };

            jest.spyOn(ContactUsEntity.prototype, 'validate').mockImplementation(() => {
                throw new Error("Invalid email format");
            });

            await controller.createContact(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Error: Invalid email format" });
        });

    });

    describe('getContacts', () => {
        it('should return paginated contacts', async () => {
            req.query = { page: "1", limit: "5", sortingOrder: "desc" };
            const mockContacts = [{ id: "1", firstName: "Alice" }];
            contactRepository.getContactsUs.mockResolvedValue({ contacts: mockContacts, totalItems: 10 });

            await controller.getContacts(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                pagination: {
                    currentPage: 1,
                    totalPages: 2,
                    totalItems: 10,
                    limit: 5
                },
                data: mockContacts
            });
        });

        it('should return 500 if repository throws an error', async () => {
            contactRepository.getContactsUs.mockRejectedValue(new Error("Database error"));

            await controller.getContacts(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error: Database error" });
        });
    });

    describe('deleteContact', () => {
        it('should return 400 if message ID is invalid', async () => {
            req.params.messageId = "invalid-id";

            await controller.deleteContact(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid message ID' });
        });

        it('should return 404 if message is not found', async () => {
            req.params.messageId = "507f191e810c19729de860ea";
            contactRepository.deleteContactUs.mockResolvedValue(null);

            await controller.deleteContact(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Message not found' });
        });

        it('should return 200 if message is deleted', async () => {
            req.params.messageId = "507f191e810c19729de860ea";
            const mockDeletedMessage = { id: "507f191e810c19729de860ea" };
            contactRepository.deleteContactUs.mockResolvedValue(mockDeletedMessage);

            await controller.deleteContact(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Message deleted successfully',
                deletedMessage: mockDeletedMessage
            });
        });

        it('should return 500 if repository throws an error', async () => {
            req.params.messageId = "507f191e810c19729de860ea";
            contactRepository.deleteContactUs.mockRejectedValue(new Error("Database error"));

            await controller.deleteContact(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error: Database error" });
        });
    });

    describe('getContactById', () => {
        it('should return 400 if ID is invalid', async () => {
            req.params.id = "invalid-id";

            await controller.getContactById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid message ID' });
        });

        it('should return 404 if contact is not found', async () => {
            req.params.id = "507f191e810c19729de860ea";
            contactRepository.getContactById.mockResolvedValue(null);

            await controller.getContactById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Contact not found' });
        });

        it('should return 200 with contact details', async () => {
            req.params.id = "507f191e810c19729de860ea";
            const mockContact = { id: "507f191e810c19729de860ea", firstName: "Alice" };
            contactRepository.getContactById.mockResolvedValue(mockContact);

            await controller.getContactById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockContact);
        });

        it('should return 500 if repository throws an error', async () => {
            req.params.id = "507f191e810c19729de860ea";
            contactRepository.getContactById.mockRejectedValue(new Error("Database error"));

            await controller.getContactById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Error: Database error" });
        });
    });
});
