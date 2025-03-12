const TestimonialController = require('../../adapters/controllers/testimoneycontroller');

const testimonialRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

let controller;

beforeAll(() => {
  controller = new TestimonialController(testimonialRepository);
});

describe('TestimonialController', () => {

  describe('createTestimonial', () => {
    it('should create a new testimonial successfully', async () => {
        
        const req = {
                body: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    content: 'Great service!',
                    company: 'TechCorp',
                    visibility: 'public'  
                },
                file: null,
            };


        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        testimonialRepository.create.mockResolvedValue(req.body);

        await controller.createTestimonial(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Testimonial created successfully.',
            testimonial: req.body,
        });
    });

    it('should return 400 if required fields are missing', async () => {
        const req = {
            body: { name: 'John Doe' }, // Missing required fields
            file: null,
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        await controller.createTestimonial(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Missing required fields: name, email, content, and company',
        });
    });
});

  // Test for retrieving a testimonial by ID
describe('getTestimonialById', () => {
it('should return a testimonial by ID', async () => {
        const req = { params: { id: '1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockTestimonial = {
            name: 'John Doe',
            email: 'john@example.com',
            content: 'Great service!',
            company: 'TechCorp',
            visibility: 'public',
            image: Buffer.from('image data'),
            toObject: function () { return this; }
        };

        testimonialRepository.findById.mockResolvedValue(mockTestimonial);

        await controller.getTestimonialById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe' }));
    });


    it('should return 404 if testimonial is not found', async () => {
        const req = { params: { id: '999' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock repository method to resolve with null (testimonial not found)
        testimonialRepository.findById.mockResolvedValue(null);

        // Call the controller method
        await controller.getTestimonialById(req, res);

        // Test the response: Expect status 404 and error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Testimonial not found' });
    });

    it('should return 500 if an error occurs during retrieval', async () => {
        const req = { params: { id: '1' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock repository method to throw an error
        testimonialRepository.findById.mockRejectedValue(new Error('Database error'));

        // Call the controller method
        await controller.getTestimonialById(req, res);

        // Test the response: Expect status 500 and error message
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve testimonial' });
    });
});

 describe('listTestimonials', () => {
        it('should list testimonials with pagination', async () => {
        const req = { query: { page: '1', limit: '10' } };
        const res = {
            json: jest.fn(),
        };

        const mockTestimonials = [{ name: 'Alice' }, { name: 'Bob' }];
        testimonialRepository.findAll.mockResolvedValue(mockTestimonials);
        testimonialRepository.count.mockResolvedValue(2);

        await controller.listTestimonials(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ testimonials: mockTestimonials }));
    });

    it('should return an empty array if no testimonials exist', async () => {
        const req = { query: { page: '1', limit: '10' } };
        const res = {
            json: jest.fn(),
        };

        testimonialRepository.findAll.mockResolvedValue([]);
        testimonialRepository.count.mockResolvedValue(0);

        await controller.listTestimonials(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ testimonials: [] }));
    });

    it('should return 400 if an error occurs during listing', async () => {
        const req = { query: { page: '1', limit: '10' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock repository method to throw an error
        testimonialRepository.findAll.mockRejectedValue(new Error('Database error'));

        // Call the controller method
        await controller.listTestimonials(req, res);

        // Test the response: Expect status 400 and error message
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
});

  // Test for updating a testimonial
 describe('updateTestimonial', () => {
    it('should update a testimonial successfully', async () => {
        const req = { 
            params: { id: '1' },
            body: { name: 'Updated Name', content: 'Updated content', email: 'updated@example.com' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        const mockUpdatedTestimonial = {
            id: '1',
            name: 'Updated Name',
            content: 'Updated content',
            email: 'updated@example.com',
            visibility: 'public', // assuming visibility is 'public' here
        };

        // Mocking the repository update method to return the updated testimonial
        testimonialRepository.update.mockResolvedValue(mockUpdatedTestimonial);

        // Call the controller method
        await controller.updateTestimonial(req, res);

        // Ensure that res.status(200) and res.json() were called with the correct arguments
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Testimonial updated successfully.',
            testimonial: mockUpdatedTestimonial,
        });
    });

    it('should return 404 if testimonial is not found', async () => {
        const req = { params: { id: '999' }, body: { name: 'Updated Name' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mocking the repository method to resolve with null (testimonial not found)
        testimonialRepository.update.mockResolvedValue(null);

        // Call the controller method
        await controller.updateTestimonial(req, res);

        // Expect status 404 and appropriate error message
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Testimonial not found' });
    });

    it('should return 400 if there is an error during the update', async () => {
        const req = { 
            params: { id: '1' },
            body: { name: 'Updated Name', content: 'Updated content' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mocking the repository method to throw an error
        testimonialRepository.update.mockRejectedValue(new Error('Update failed'));

        // Call the controller method
        await controller.updateTestimonial(req, res);

        // Expect status 400 and appropriate error message
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCall
    });
  });

  // Test for deleting a testimonial
  describe('deleteTestimonial', () => {
    it('should delete a testimonial successfully', async () => {
      const req = { params: { id: '1' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      testimonialRepository.delete.mockResolvedValue({ name: 'John Doe' });

      await controller.deleteTestimonial(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Testimonial deleted successfully.',
        deleted: { name: 'John Doe' },
      });
    });

    it('should return 404 if testimonial is not found', async () => {
      const req = { params: { id: '999' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      testimonialRepository.delete.mockResolvedValue(null);

      await controller.deleteTestimonial(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Testimonial not found' });
    });
  });
});
