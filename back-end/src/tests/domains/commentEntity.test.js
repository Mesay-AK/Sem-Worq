const CommentEntity = require('../../Domain/commentEntity');

describe('CommentEntity', () => {
    describe('constructor', () => {
        it('should initialize with correct properties', () => {
            const comment = new CommentEntity('blog123', 'user@example.com', 'This is a comment.');
            
            expect(comment.blogId).toBe('blog123');
            expect(comment.email).toBe('user@example.com');
            expect(comment.content).toBe('This is a comment.');
        });
    });

    describe('validateForComment method', () => {
        it('should throw error if email is missing', () => {
            const comment = new CommentEntity('blog123', '', 'This is a valid comment.');
            expect(() => comment.validateForComment()).toThrowError("Invalid email address.");
        });

        it('should throw error if email format is invalid', () => {
            const comment = new CommentEntity('blog123', 'invalidemail', 'This is a valid comment.');
            expect(() => comment.validateForComment()).toThrowError("Invalid email address.");
        });

        it('should throw error if email format is missing "@"', () => {
            const comment = new CommentEntity('blog123', 'userexample.com', 'This is a valid comment.');
            expect(() => comment.validateForComment()).toThrowError("Invalid email address.");
        });

        it('should throw error if comment content is empty', () => {
            const comment = new CommentEntity('blog123', 'user@example.com', '');
            expect(() => comment.validateForComment()).toThrowError("Comment content cannot be empty.");
        });

        it('should throw error if comment content is just whitespace', () => {
            const comment = new CommentEntity('blog123', 'user@example.com', '   ');
            expect(() => comment.validateForComment()).toThrowError("Comment content cannot be empty.");
        });

        it('should not throw error if email and content are valid', () => {
            const comment = new CommentEntity('blog123', 'user@example.com', 'This is a valid comment.');
            expect(() => comment.validateForComment()).not.toThrow();
        });
    });
});
