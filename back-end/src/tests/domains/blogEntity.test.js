const BlogEntity = require('../../Domain/blogEntity');

describe('BlogEntity', () => {
    describe('constructor', () => {
        it('should initialize with correct properties', () => {
            const blog = new BlogEntity({
                title: 'Blog Title',
                content: 'This is the blog content.',
                author: 'Author',
                image: 'image.jpg',
                tags: ['tag1', 'tag2'],
                status: 'draft',
                comments: [],
                liked: [],
                disliked: []
            });

            expect(blog.title).toBe('Blog Title');
            expect(blog.content).toBe('This is the blog content.');
            expect(blog.author).toBe('Author');
            expect(blog.image).toBe('image.jpg');
            expect(blog.tags).toEqual(['tag1', 'tag2']);
            expect(blog.status).toBe('draft');
            expect(blog.comments).toEqual([]);
            expect(blog.liked).toEqual([]);
            expect(blog.disliked).toEqual([]);
        });
    });

    describe('validate method', () => {
        it('should throw error if title is less than 3 characters', () => {
            const blog = new BlogEntity({ title: 'a', content: 'valid content', author: 'Author', image: 'image.jpg' });
            expect(() => blog.validate()).toThrowError("Blog title must be at least 3 characters long.");
        });

        it('should throw error if content is less than 10 characters', () => {
            const blog = new BlogEntity({ title: 'Valid title', content: 'short', author: 'Author', image: 'image.jpg' });
            expect(() => blog.validate()).toThrowError("Blog content must be at least 10 characters long.");
        });

        it('should throw error if author name is less than 2 characters', () => {
            const blog = new BlogEntity({ title: 'Valid title', content: 'Valid content', author: 'A', image: 'image.jpg' });
            expect(() => blog.validate()).toThrowError("Author name must be at least 2 characters long.");
        });

        it('should throw error if image is missing', () => {
            const blog = new BlogEntity({ title: 'Valid title', content: 'Valid content', author: 'Author' });
            expect(() => blog.validate()).toThrowError("Blog image is required.");
        });

        it('should throw error if liked or disliked arrays are non-empty upon creation', () => {
            const blog = new BlogEntity({ title: 'Valid title', content: 'Valid content', author: 'Author', image: 'image.jpg', liked: [1] });
            expect(() => blog.validate()).toThrowError("Cannot like or dislike blog upon creation.");
        });
    });

    describe('validateOnUpdate method', () => {
        it('should throw error if title is less than 3 characters on update', () => {
            const blog = new BlogEntity({ title: 'Valid title', content: 'Valid content', author: 'Author', image: 'image.jpg' });
            blog.title = 'a';
            expect(() => blog.validateOnUpdate()).toThrowError("Blog title must be at least 3 characters long.");
        });

        it('should throw error if content is less than 10 characters on update', () => {
            const blog = new BlogEntity({ title: 'Valid title', content: 'Valid content', author: 'Author', image: 'image.jpg' });
            blog.content = 'short';
            expect(() => blog.validateOnUpdate()).toThrowError("Blog content must be at least 10 characters long.");
        });

        it('should throw error if status is invalid on update', () => {
            const blog = new BlogEntity({ title: 'Valid title', content: 'Valid content', author: 'Author', image: 'image.jpg' });
            blog.status = 'invalidStatus';
            expect(() => blog.validateOnUpdate()).toThrowError("Invalid status. Allowed values are 'draft' or 'published'.");
        });

        it('should throw error if liked or disliked arrays are non-empty on update', () => {
            const blog = new BlogEntity({ title: 'Valid title', content: 'Valid content', author: 'Author', image: 'image.jpg' });
            blog.liked = [1];
            expect(() => blog.validateOnUpdate()).toThrowError("Cannot like or dislike blog upon update.");
        });
    });
});
