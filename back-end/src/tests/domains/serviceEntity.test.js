const ServicesEntity = require('../../Domain/ServicesEntity');

describe('ServicesEntity', () => {
    describe('constructor', () => {
        it('should initialize with correct properties', () => {
            const service = new ServicesEntity({
                title: 'Service Title',
                description: 'This is a service description.',
                image: 'image.jpg'
            });

            expect(service.title).toBe('Service Title');
            expect(service.description).toBe('This is a service description.');
            expect(service.image).toBe('image.jpg');
        });
    });

    describe('validate method', () => {
        it('should throw error if title is less than 3 characters', () => {
            const service = new ServicesEntity({
                title: 'ab',
                description: 'Valid description.',
            });
            expect(() => service.validate()).toThrowError("Service title must be at least 3 characters long.");
        });

        it('should throw error if description is less than 10 characters', () => {
            const service = new ServicesEntity({
                title: 'Valid title',
                description: 'Short'
            });
            expect(() => service.validate()).toThrowError("Service description must be at least 10 characters long.");
        });

        it('should not throw error if title and description are valid', () => {
            const service = new ServicesEntity({
                title: 'Valid title',
                description: 'This is a valid description that exceeds 10 characters.'
            });
            expect(() => service.validate()).not.toThrow();
        });

        it('should trim whitespace from title and description', () => {
            const service = new ServicesEntity({
                title: '   Valid title   ',
                description: '   Valid description   '
            });
            expect(() => service.validate()).not.toThrow();
            expect(service.title).toBe('Valid title');
            expect(service.description).toBe('Valid description');
        });
    });
});
