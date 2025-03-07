// Import the repository and the mocked Admin model
const AdminRepository = require('../../Repositories/AdminRepository');
const Admin = require('../../Infrastructures/models/AdminModel');


jest.mock('../../Infrastructures/models/AdminModel');

let adminRepository;

beforeEach(() => {
    adminRepository = new AdminRepository();
});

describe('AdminRepository', () => {

    describe('add method', () => {
        it('should create and return an admin', async () => {
            const adminData = { name: 'John Doe', email: 'john@example.com' };


            Admin.mockImplementationOnce(() => ({
                save: jest.fn().mockResolvedValue({ _id: '123', ...adminData }),
            }));

            const result = await adminRepository.add(adminData);

            expect(result).toEqual({ _id: '123', name: 'John Doe', email: 'john@example.com' });
            expect(Admin).toHaveBeenCalledWith(adminData);
        });

        it('should throw an error if creation fails', async () => {
            const adminData = { name: 'John Doe', email: 'john@example.com' };

            Admin.mockImplementationOnce(() => ({
                save: jest.fn().mockRejectedValue(new Error('Database error')),
            }));

            await expect(adminRepository.add(adminData)).rejects.toThrow('Failed to create admin. Please check the provided data.');
        });
    });

    describe('findByEmail method', () => {
        it('should return an admin by email', async () => {
            const email = 'john@example.com';

            Admin.findOne.mockResolvedValue({ _id: '123', name: 'John Doe', email });

            const result = await adminRepository.findByEmail(email);

            expect(result).toEqual({ _id: '123', name: 'John Doe', email });
            expect(Admin.findOne).toHaveBeenCalledWith({ email });
        });

        it('should return undefined if no admin is found', async () => {
            const email = 'john@example.com';

            Admin.findOne.mockResolvedValue(null);

            const result = await adminRepository.findByEmail(email);

            expect(result).toBeUndefined();
        });

        it('should throw an error if fetching fails', async () => {
            const email = 'john@example.com';

            Admin.findOne.mockRejectedValue(new Error('Database error'));

            await expect(adminRepository.findByEmail(email)).rejects.toThrow('Failed to fetch admin by email.');
        });
    });

    describe('findById method', () => {
        it('should return an admin by ID', async () => {
            const id = '123';
            Admin.findById.mockResolvedValue({ _id: id, name: 'John Doe', email: 'john@example.com' });

            const result = await adminRepository.findById(id);

            expect(result).toEqual({ _id: id, name: 'John Doe', email: 'john@example.com' });
            expect(Admin.findById).toHaveBeenCalledWith(id, '-password -resetToken');
        });

        it('should throw an error if no admin is found', async () => {
        const id = 'some-invalid-id';
        Admin.findById.mockResolvedValue(null); // Mock the case where no admin is found

        // Update the expected error message to match the one thrown in the repository
        await expect(adminRepository.findById(id)).rejects.toThrow('Failed to fetch admin by ID.');
        });


        it('should throw an error if fetching fails', async () => {
            const id = '123';

            Admin.findById.mockRejectedValue(new Error('Database error'));

            await expect(adminRepository.findById(id)).rejects.toThrow('Failed to fetch admin by ID.');
        });
    });

    describe('update method', () => {
        it('should update an admin and return the updated admin', async () => {
            const id = '123';
            const updateData = { name: 'Jane Doe' };

            Admin.findByIdAndUpdate.mockResolvedValue({ _id: id, ...updateData, email: 'john@example.com' });

            const result = await adminRepository.update(id, updateData);

            expect(result).toEqual({ _id: id, ...updateData, email: 'john@example.com' });
            expect(Admin.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: updateData }, { new: true, select: '-password -resetToken' });
        });

        it('should throw an error if update fails', async () => {
            const id = '123';
            const updateData = { name: 'Jane Doe' };

            Admin.findByIdAndUpdate.mockResolvedValue(null);

            await expect(adminRepository.update(id, updateData)).rejects.toThrow('Admin not found or update failed.');
        });

        it('should throw an error if updating fails', async () => {
            const id = '123';
            const updateData = { name: 'Jane Doe' };

            Admin.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

            await expect(adminRepository.update(id, updateData)).rejects.toThrow('Error updating admin: Database error');
        });
    });

    describe('delete method', () => {
        it('should delete an admin and return the deleted admin data', async () => {
            const id = '123';

            Admin.findByIdAndDelete.mockResolvedValue({ _id: id, name: 'John Doe', email: 'john@example.com', role: 'admin' });

            const result = await adminRepository.delete(id);

            expect(result).toEqual({ _id: id, name: 'John Doe', email: 'john@example.com', role: 'admin' });
            expect(Admin.findByIdAndDelete).toHaveBeenCalledWith(id);
        });

        it('should throw an error if deletion fails', async () => {
            const id = '123';
            Admin.findByIdAndDelete.mockResolvedValue(null);

            await expect(adminRepository.delete(id)).rejects.toThrow('Admin not found.');
        });

        it('should throw an error if deletion fails', async () => {
            const id = '123';

            Admin.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

            await expect(adminRepository.delete(id)).rejects.toThrow('Error deleting admin: Database error');
        });
    });

    describe('getAll method', () => {
        it('should return all admins', async () => {

            Admin.find.mockResolvedValue([{ _id: '123', name: 'John Doe', email: 'john@example.com' }]);

            const result = await adminRepository.getAll();

            expect(result).toEqual([{ _id: '123', name: 'John Doe', email: 'john@example.com' }]);
            expect(Admin.find).toHaveBeenCalledWith({}, '-password -resetToken');
        });

        it('should throw an error if fetching all admins fails', async () => {

            Admin.find.mockRejectedValue(new Error('Database error'));

            await expect(adminRepository.getAll()).rejects.toThrow('Error fetching admins: Database error');
        });
    });

});

