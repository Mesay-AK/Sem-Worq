const BlogRepository = require('../../Repositories/blogsRepo');
const BlogModel = require('../../Infrastructures/models/blogModel');

jest.mock('../../Infrastructures/models/blogModel'); // Mock Mongoose Model

describe('BlogRepository', () => {
    let blogRepository;

    beforeEach(() => {
        blogRepository = new BlogRepository();
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create a new blog successfully', async () => {
            const blogData = { title: 'Test Blog', content: 'Test Content' };
            BlogModel.findOne.mockResolvedValue(null); // Simulate no existing blog
            BlogModel.prototype.save = jest.fn().mockResolvedValue(blogData); // Mock save

            const result = await blogRepository.create(blogData);

            expect(result).toEqual(blogData);
            expect(BlogModel.prototype.save).toHaveBeenCalled();
        });

        it('should throw an error if blog already exists', async () => {
            const blogData = { title: 'Test Blog', content: 'Test Content' };
            BlogModel.findOne.mockResolvedValue(blogData); // Simulate existing blog

            await expect(blogRepository.create(blogData)).rejects.toThrow('Blog already Exists');
        });
    });

    describe('update', () => {
        it('should update a blog successfully', async () => {
            const updatedBlog = { title: 'Updated Title' };
            BlogModel.findByIdAndUpdate.mockResolvedValue(updatedBlog);

            const result = await blogRepository.update('123', updatedBlog);

            expect(result).toEqual(updatedBlog);
            expect(BlogModel.findByIdAndUpdate).toHaveBeenCalledWith('123', expect.objectContaining(updatedBlog), { new: true });
        });
    });

    describe('delete', () => {
        it('should delete a blog successfully', async () => {
            const deletedBlog = { _id: '123', title: 'Test Blog' };
            BlogModel.findByIdAndDelete.mockResolvedValue(deletedBlog);

            const result = await blogRepository.delete('123');

            expect(result).toEqual(deletedBlog);
            expect(BlogModel.findByIdAndDelete).toHaveBeenCalledWith('123');
        });

        it('should throw an error when blog is not found', async () => {
            BlogModel.findByIdAndDelete.mockResolvedValue(null);

            await expect(blogRepository.delete('123')).rejects.toThrow('Blog not found');
        });
    });

    describe('findById', () => {
        it('should return a blog when found', async () => {
            const blog = { _id: '123', title: 'Test Blog' };
            BlogModel.findById.mockResolvedValue(blog);

            const result = await blogRepository.findById('123');

            expect(result).toEqual(blog);
            expect(BlogModel.findById).toHaveBeenCalledWith('123');
        });

        it('should return null if blog not found', async () => {
            BlogModel.findById.mockResolvedValue(null);

            const result = await blogRepository.findById('123');

            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should return paginated blogs', async () => {
            const blogs = [{ _id: '1', title: 'Blog 1' }, { _id: '2', title: 'Blog 2' }];
            BlogModel.find.mockReturnValue({ skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), sort: jest.fn().mockResolvedValue(blogs) });

            const result = await blogRepository.findAll({}, 1, 2);

            expect(result).toEqual(blogs);
            expect(BlogModel.find).toHaveBeenCalled();
        });
    });

    describe('addComment', () => {
        it('should add a comment to a blog', async () => {
            const updatedBlog = { _id: '123', comments: [{ text: 'New Comment' }] };
            BlogModel.findByIdAndUpdate.mockResolvedValue(updatedBlog);

            const result = await blogRepository.addComment('123', { text: 'New Comment' });

            expect(result).toEqual(updatedBlog);
        });
    });

    describe('removeComment', () => {
        it('should remove a comment from a blog', async () => {
            const updatedBlog = { _id: '123', comments: [] };
            BlogModel.findByIdAndUpdate.mockResolvedValue(updatedBlog);

            const result = await blogRepository.removeComment('123', '456');

            expect(result).toEqual(updatedBlog);
        });
    });

    describe('addFeedback', () => {
        it('should allow liking a blog', async () => {
            const blog = { _id: '123', feedback: [], likeCount: 0, dislikeCount: 0 };
            BlogModel.findById.mockResolvedValue(blog);
            BlogModel.findByIdAndUpdate.mockResolvedValue({ ...blog, likeCount: 1 });

            const result = await blogRepository.addFeedback('123', '192.168.0.1', 'liked');

            expect(result.likeCount).toBe(1);
        });

        it('should not allow duplicate feedback', async () => {
            const blog = { _id: '123', feedback: ['192.168.0.1'] };
            BlogModel.findById.mockResolvedValue(blog);

            await expect(blogRepository.addFeedback('123', '192.168.0.1', 'liked')).rejects.toThrow(/You have already/);
        });
    });

        describe('getLikes', () => {
        it('should return like count for a blog', async () => {
            const mockBlog = { _id: '123', likeCount: 10 };

            BlogModel.findById.mockResolvedValue(mockBlog);

            const result = await blogRepository.getLikes('123');

            expect(result).toBe(10);
        });

        it('should throw error if blog not found for getLikes', async () => {
            BlogModel.findById.mockResolvedValue(null);

            await expect(blogRepository.getLikes('123'))
                .rejects
                .toThrow('Blog not found');
        });

        // it('should throw error if getLikes fails', async () => {
        //     BlogModel.findById.mockRejectedValue(new Error('Database Error'));

        //     await expect(blogRepository.getLikes('123'))
        //         .rejects
        //         .toThrow('Database Error');
        // });
    });

    // Test for getDislikes method
    describe('getDislikes', () => {
        it('should return dislike count for a blog', async () => {
            const mockBlog = { _id: '123', dislikeCount: 5 };

            BlogModel.findById.mockResolvedValue(mockBlog);

            const result = await blogRepository.getDislikes('123');

            expect(result).toBe(5);
        });

        it('should throw error if blog not found for getDislikes', async () => {
            BlogModel.findById.mockResolvedValue(null);

            await expect(blogRepository.getDislikes('123'))
                .rejects
                .toThrow('Blog not found');
        });

        // it('should throw error if getDislikes fails', async () => {
        //     BlogModel.findById.mockRejectedValue(new Error('Database Error'));

        //     await expect(blogRepository.getDislikes('123'))
        //         .rejects
        //         .toThrow('Database Error');
        // });
    });
});
