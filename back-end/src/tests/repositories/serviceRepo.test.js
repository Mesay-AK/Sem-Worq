// serviceRepository.test.js
const ServiceModel = require('../../Infrastructures/models/ServicesModel');
const ServiceRepository = require('../../repositories/serviceRepository');

// Mock the ServiceModel methods
jest.mock('../../Infrastructures/models/ServicesModel');

describe('ServiceRepository', () => {
    let serviceRepository;

    beforeEach(() => {
        serviceRepository = new ServiceRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test for CreateService method
    describe('CreateService', () => {
        it('should create a service if it does not already exist', async () => {
            const serviceData = { title: 'Service 1', description: 'Description of service 1' };
            const mockService = { _id: '123', ...serviceData };

            // Simulate no existing service with the same title
            ServiceModel.findOne.mockResolvedValue(null);
            ServiceModel.prototype.save.mockResolvedValue(mockService);

            const result = await serviceRepository.CreateService(serviceData);

            expect(result).toEqual(mockService);
            expect(ServiceModel.findOne).toHaveBeenCalledWith({ title: serviceData.title });
            expect(ServiceModel.prototype.save).toHaveBeenCalled();
        });

        it('should throw an error if service already exists', async () => {
            const serviceData = { title: 'Service 1', description: 'Description of service 1' };

            // Simulate that the service already exists
            ServiceModel.findOne.mockResolvedValue(true);

            await expect(serviceRepository.CreateService(serviceData))
                .rejects
                .toThrow('Service already Exists.');
        });

        it('should throw an error if creating service fails', async () => {
            const serviceData = { title: 'Service 1', description: 'Description of service 1' };

            // Simulate an error during saving
            ServiceModel.findOne.mockResolvedValue(null);
            ServiceModel.prototype.save.mockRejectedValue(new Error('Save failed'));

            await expect(serviceRepository.CreateService(serviceData))
                .rejects
                .toThrow('Error while creating service: Save failed');
        });
    });

    // Test for UpdateService method
    describe('UpdateService', () => {
        it('should update the service if found', async () => {
            const id = '123';
            const updatedFields = { title: 'Updated Service' };
            const updatedService = { _id: '123', ...updatedFields };

            // Simulate finding and updating the service
            ServiceModel.findByIdAndUpdate.mockResolvedValue(updatedService);

            const result = await serviceRepository.UpdateService(id, updatedFields);

            expect(result).toEqual(updatedService);
            expect(ServiceModel.findByIdAndUpdate).toHaveBeenCalledWith(id, updatedFields, { new: true });
        });

        it('should throw an error if the service to update is not found', async () => {
            const id = '123';
            const updatedFields = { title: 'Updated Service' };

            // Simulate service not found for update
            ServiceModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(serviceRepository.UpdateService(id, updatedFields))
                .rejects
                .toThrow('Service with ID 123 not found.');
        });

        it('should throw an error if updating service fails', async () => {
            const id = '123';
            const updatedFields = { title: 'Updated Service' };

            // Simulate error during update
            ServiceModel.findByIdAndUpdate.mockRejectedValue(new Error('Update failed'));

            await expect(serviceRepository.UpdateService(id, updatedFields))
                .rejects
                .toThrow('Error updating service: Update failed');
        });
    });

    // Test for DeleteService method
    describe('DeleteService', () => {
        it('should delete the service if found', async () => {
            const id = '123';
            const mockDeletedService = { _id: '123', title: 'Service 1', description: 'Description' };

            // Simulate service being deleted
            ServiceModel.findByIdAndDelete.mockResolvedValue(mockDeletedService);

            const result = await serviceRepository.DeleteService(id);

            expect(result).toEqual(mockDeletedService);
            expect(ServiceModel.findByIdAndDelete).toHaveBeenCalledWith(id);
        });

        it('should throw an error if the service to delete is not found', async () => {
            const id = '123';

            // Simulate service not found for deletion
            ServiceModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(serviceRepository.DeleteService(id))
                .rejects
                .toThrow('Service with ID 123 not found.');
        });

        it('should throw an error if deleting service fails', async () => {
            const id = '123';

            // Simulate error during deletion
            ServiceModel.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

            await expect(serviceRepository.DeleteService(id))
                .rejects
                .toThrow('Error deleting service: Delete failed');
        });
    });

    // Test for GetAllServices method
    describe('GetAllServices', () => {
        it('should return all services with pagination', async () => {
            const page = 1;
            const limit = 10;
            const mockServices = [{ _id: '123', title: 'Service 1', description: 'Description' }];
            const skip = (page - 1) * limit;

            // Simulate finding all services
            ServiceModel.find.mockResolvedValue(mockServices);

            const result = await serviceRepository.GetAllServices(page, limit);

            expect(result).toEqual(mockServices);
            expect(ServiceModel.find).toHaveBeenCalledWith(expect.objectContaining({}));
            expect(ServiceModel.find).toHaveBeenCalledWith(expect.objectContaining({}))
        });

        it('should throw an error if fetching services fails', async () => {
            const page = 1;
            const limit = 10;

            // Simulate failure of fetching services
            ServiceModel.find.mockRejectedValue(new Error('Find failed'));

            await expect(serviceRepository.GetAllServices(page, limit))
                .rejects
                .toThrow('Error retrieving services: Find failed');
        });
    });

    // Test for count method
    describe('count', () => {
        it('should return the total count of services', async () => {
            const totalServices = 5;

            // Simulate countDocuments operation
            ServiceModel.countDocuments.mockResolvedValue(totalServices);

            const result = await serviceRepository.count();

            expect(result).toBe(totalServices);
            expect(ServiceModel.countDocuments).toHaveBeenCalled();
        });

        it('should throw an error if counting services fails', async () => {
            // Simulate countDocuments failure
            ServiceModel.countDocuments.mockRejectedValue(new Error('Count failed'));

            await expect(serviceRepository.count())
                .rejects
                .toThrow('Failed to count services. Please try again later.');
        });
    });

    // Test for GetServiceById method
    describe('GetServiceById', () => {
        it('should return service if found by ID', async () => {
            const mockService = { _id: '123', title: 'Service 1', description: 'Description' };

            // Simulate finding a service by ID
            ServiceModel.findById.mockResolvedValue(mockService);

            const result = await serviceRepository.GetServiceById('123');

            expect(result).toEqual(mockService);
            expect(ServiceModel.findById).toHaveBeenCalledWith('123');
        });

        it('should throw an error if service is not found by ID', async () => {
            // Simulate service not found
            ServiceModel.findById.mockResolvedValue(null);

            await expect(serviceRepository.GetServiceById('123'))
                .rejects
                .toThrow('Service with ID 123 not found.');
        });

        it('should throw an error if fetching service fails', async () => {
            // Simulate error during findById
            ServiceModel.findById.mockRejectedValue(new Error('Find failed'));

            await expect(serviceRepository.GetServiceById('123'))
                .rejects
                .toThrow('Error retrieving service: Find failed');
        });
    });
});
