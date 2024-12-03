// const { createContactController, getContactsController, deleteContactController } = require('../../adapters/controllers/ContactUsController');
// const contactUseCases = require('../../Usecases/ContactUsUsecase');  
// const mongoose = require('mongoose');

// // Mock the entire contactUseCases module
// jest.mock('../../Usecases/ContactUsUsecase');  // This mocks the functions in contactUseCases

// describe('Contact Us Controller Tests', () => {
//   let res;
//   let req;

//   beforeEach(() => {
//     res = {
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnThis(),
//     };

//     req = {
//       body: {
//         firstName: 'John',
//         lastName: 'Doe',
//         email: 'john.doe@example.com',
//         subject: 'Test Subject',
//         message: 'Test message',
//       },
//     };
//   });

//   describe('createContactController', () => {
//     it('should create a new contact and return a success response', async () => {
//       // Mock successful use case response
//       const mockResponse = { 
//         firstName: 'John', 
//         lastName: 'Doe', 
//         email: 'john.doe@example.com', 
//         subject: 'Test Subject', 
//         message: 'Test message' 
//       };
      
//       contactUseCases.createContactUs.mockResolvedValue(mockResponse);  // Mocking success

//       // Call the controller
//       await createContactController(req, res);

//       // Verify that the response is sent with status 201 (Created) and the correct data
//       expect(res.status).toHaveBeenCalledWith(201);
//       expect(res.json).toHaveBeenCalledWith(mockResponse);
//     });

//     it('should handle errors and return an error response', async () => {
//       const error = new Error('Something went wrong');
      
//       // Mock the use case to throw an error
//       contactUseCases.createContactUs.mockRejectedValue(error);

//       // Call the controller
//       await createContactController(req, res);

//       // Verify that the error response is sent with status 400 (Bad Request)
//       expect(res.status).toHaveBeenCalledWith(400);
//       expect(res.json).toHaveBeenCalledWith({ message: `Error: ${error.message}` });
//     });
//   });

  
// //   describe('getContactsController', () => {
// //     it('should return a list of contacts with pagination', async () => {
// //       req.query = { page: 1, limit: 10 };

// //       const mockContacts = [
// //         { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', message: 'Test message 1' },
// //         { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com', message: 'Test message 2' }
// //       ];
// //       const mockPagination = { totalPages: 1, totalItems: 2 };
      
// //       // Mock the use case for getting contacts
// //       contactUseCases.getContactsUseCase.mockResolvedValue({
// //         contacts: mockContacts,
// //         ...mockPagination,
// //       });

// //       // Call the controller
// //       await getContactsController(req, res);

// //       // Check that pagination and data are included in the response
// //       expect(res.status).toHaveBeenCalledWith(200);  // HTTP status 200 for OK
// //       expect(res.json).toHaveBeenCalledWith({
// //         pagination: { currentPage: 1, totalPages: 1, totalItems: 2, limit: 10 },
// //         data: { contacts: mockContacts }
// //       });
// //     });

// //     it('should return an empty list if no contacts are found', async () => {
// //       req.query = { page: 1, limit: 10 };

// //       const mockContacts = [];
// //       const mockPagination = { totalPages: 0, totalItems: 0 };

// //       // Mock the use case for getting contacts (no contacts in the DB)
// //       contactUseCases.getContactsUseCase.mockResolvedValue({
// //         contacts: mockContacts,
// //         ...mockPagination,
// //       });

// //       // Call the controller
// //       await getContactsController(req, res);

// //       // Check that the response is correct for an empty list
// //       expect(res.status).toHaveBeenCalledWith(200);
// //       expect(res.json).toHaveBeenCalledWith({
// //         pagination: { currentPage: 1, totalPages: 0, totalItems: 0, limit: 10 },
// //         data: { contacts: mockContacts }
// //       });
// //     });

// //     it('should handle errors and return an error response', async () => {
// //       const error = new Error('Error fetching contacts');
      
// //       // Mock the use case to throw an error
// //       contactUseCases.getContactsUseCase.mockRejectedValue(error);

// //       // Call the controller
// //       await getContactsController(req, res);

// //       // Verify that the error response is sent
// //       expect(res.status).toHaveBeenCalledWith(500);  // Internal server error
// //       expect(res.json).toHaveBeenCalledWith({ message: `Error in fetching contacts from the database` });
// //     });
// //   });

// //   describe('deleteContactController', () => {
// //     it('should delete a contact message and return success', async () => {
// //       const contactId = new mongoose.Types.ObjectId();
// //       req.params = { id: contactId };

// //       const mockDeletedContact = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };

// //       // Mock the use case for deleting a contact
// //       contactUseCases.deleteContactUsecase.mockResolvedValue(mockDeletedContact);

// //       // Call the controller
// //       await deleteContactController(req, res);

// //       // Check that response has correct status and message
// //       expect(res.status).toHaveBeenCalledWith(200);
// //       expect(res.json).toHaveBeenCalledWith({ message: 'Message deleted successfully', deletedMessage: mockDeletedContact });
// //     });

// //     it('should handle invalid ObjectId format and return a 400 error', async () => {
// //       req.params = { id: 'invalidObjectId' };

// //       // Call the controller
// //       await deleteContactController(req, res);

// //       // Verify that the response has status 400 (Bad Request) for invalid ObjectId
// //       expect(res.status).toHaveBeenCalledWith(400);
// //       expect(res.json).toHaveBeenCalledWith({ message: 'Invalid message ID' });
// //     });

// //     it('should handle errors in deleting a contact and return an error response', async () => {
// //       const error = new Error('Error in deleting contact');
// //       const contactId = new mongoose.Types.ObjectId();
// //       req.params = { id: contactId };

// //       // Mock the use case to throw an error
// //       contactUseCases.deleteContactUsecase.mockRejectedValue(error);

// //       // Call the controller
// //       await deleteContactController(req, res);

// //       // Verify that the error response is sent
// //       expect(res.status).toHaveBeenCalledWith(500);  // Internal server error
// //       expect(res.json).toHaveBeenCalledWith({ message: `Error: ${error.message}` });
// //     });

// //     it('should return 404 if the contact message is not found', async () => {
// //       const contactId = new mongoose.Types.ObjectId();
// //       req.params = { id: contactId };

// //       // Mock the use case to return null (indicating not found)
// //       contactUseCases.deleteContactUsecase.mockResolvedValue(null);

// //       // Call the controller
// //       await deleteContactController(req, res);

// //       // Verify that a 404 response is sent
// //       expect(res.status).toHaveBeenCalledWith(404);
// //       expect(res.json).toHaveBeenCalledWith({ message: 'Message not found' });
// //     });
// //   });
// // });
