const TestimonialEntity = require('../../Domain/testimoneyEntity');

describe('TestimonialEntity', () => {
    describe('constructor', () => {
        it('should initialize with correct properties', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'This is a testimonial content.',
                company: 'Some Company',
                visibility: 'public',
                image: 'image.jpg'
            });

            expect(testimonial.name).toBe('John Doe');
            expect(testimonial.email).toBe('john.doe@example.com');
            expect(testimonial.content).toBe('This is a testimonial content.');
            expect(testimonial.company).toBe('Some Company');
            expect(testimonial.visibility).toBe('public');
            expect(testimonial.image).toBe('image.jpg');
        });
    });

    describe('validate method', () => {
        it('should throw error if name is less than 3 characters', () => {
            const testimonial = new TestimonialEntity({
                name: 'Jo',
                email: 'john.doe@example.com',
                content: 'Valid content.',
                company: 'Valid Company',
                visibility: 'public'
            });
            expect(() => testimonial.validate()).toThrowError("Testimonial name must be at least 3 characters long.");
        });

        it('should throw error if email format is invalid', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'invalid-email',
                content: 'Valid content.',
                company: 'Valid Company',
                visibility: 'public'
            });
            expect(() => testimonial.validate()).toThrowError("Invalid email format.");
        });

        it('should throw error if content is less than 10 characters', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'Short',
                company: 'Valid Company',
                visibility: 'public'
            });
            expect(() => testimonial.validate()).toThrowError("Testimonial content must be at least 10 characters long.");
        });

        it('should throw error if company is less than 3 characters', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'Valid content.',
                company: 'XY',
                visibility: 'public'
            });
            expect(() => testimonial.validate()).toThrowError("Company Name must be at least 3 characters long.");
        });

        it('should throw error if visibility is not "public" or "private"', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'Valid content.',
                company: 'Valid Company',
                visibility: 'restricted'
            });
            expect(() => testimonial.validate()).toThrowError("Visibility must be either 'public' or 'private'.");
        });

        it('should not throw error if all fields are valid', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'This is a valid testimonial content.',
                company: 'Valid Company',
                visibility: 'public'
            });
            expect(() => testimonial.validate()).not.toThrow();
        });
    });

    describe('validateOnUpdate method', () => {
        it('should throw error if name is less than 3 characters on update', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'Valid content.',
                company: 'Valid Company',
                visibility: 'public'
            });
            testimonial.name = 'Jo';
            expect(() => testimonial.validateOnUpdate()).toThrowError("Testimonial name must be at least 3 characters long.");
        });

        it('should throw error if email format is invalid on update', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'Valid content.',
                company: 'Valid Company',
                visibility: 'public'
            });
            testimonial.email = 'invalid-email';
            expect(() => testimonial.validateOnUpdate()).toThrowError("Invalid email format.");
        });

        it('should throw error if content is less than 10 characters on update', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'Valid content.',
                company: 'Valid Company',
                visibility: 'public'
            });
            testimonial.content = 'Short';
            expect(() => testimonial.validateOnUpdate()).toThrowError("Testimonial content must be at least 10 characters long.");
        });

        it('should throw error if company is less than 3 characters on update', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'Valid content.',
                company: 'Valid Company',
                visibility: 'public'
            });
            testimonial.company = 'XY';
            expect(() => testimonial.validateOnUpdate()).toThrowError("Company Name must be at least 3 characters long.");
        });

        it('should not throw error if all fields are valid on update', () => {
            const testimonial = new TestimonialEntity({
                name: 'John Doe',
                email: 'john.doe@example.com',
                content: 'Valid content.',
                company: 'Valid Company',
                visibility: 'public'
            });
            testimonial.name = 'Updated Name';
            testimonial.email = 'updated.email@example.com';
            testimonial.content = 'Updated content with more than 10 characters.';
            testimonial.company = 'Updated Company';
            testimonial.visibility = 'private';
            expect(() => testimonial.validateOnUpdate()).not.toThrow();
        });
    });
});
