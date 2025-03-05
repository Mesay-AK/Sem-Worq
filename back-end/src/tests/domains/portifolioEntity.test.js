const PortfolioEntity = require('../../Domain/portfolioEntity');

describe('PortfolioEntity', () => {
    describe('constructor', () => {
        it('should initialize with correct properties', () => {
            const portfolio = new PortfolioEntity({
                title: 'Portfolio Title',
                description: 'This is a portfolio description.',
                tags: ['tag1', 'tag2'],
                image: 'image.jpg',
                visibility: 'public'
            });
            
            expect(portfolio.title).toBe('Portfolio Title');
            expect(portfolio.description).toBe('This is a portfolio description.');
            expect(portfolio.tags).toEqual(['tag1', 'tag2']);
            expect(portfolio.image).toBe('image.jpg');
            expect(portfolio.visibility).toBe('public');
        });
    });

    describe('validate method', () => {
        it('should throw error if title is less than 3 characters', () => {
            const portfolio = new PortfolioEntity({
                title: 'aa',
                description: 'Valid description',
                visibility: 'public'
            });
            expect(() => portfolio.validate()).toThrowError("Portfolio title must be at least 3 characters long.");
        });

        it('should throw error if description is less than 10 characters', () => {
            const portfolio = new PortfolioEntity({
                title: 'Valid title',
                description: 'Short',
                visibility: 'public'
            });
            expect(() => portfolio.validate()).toThrowError("Portfolio description must be at least 10 characters long.");
        });

        it('should throw error if visibility is not "public" or "private"', () => {
            const portfolio = new PortfolioEntity({
                title: 'Valid title',
                description: 'Valid description.',
                visibility: 'restricted'
            });
            expect(() => portfolio.validate()).toThrowError("Visibility must be either 'public' or 'private'.");
        });

        it('should not throw error if all fields are valid', () => {
            const portfolio = new PortfolioEntity({
                title: 'Valid title',
                description: 'This is a valid description.',
                visibility: 'public'
            });
            expect(() => portfolio.validate()).not.toThrow();
        });
    });

    describe('validateOnUpdate method', () => {
        it('should throw error if title is less than 3 characters on update', () => {
            const portfolio = new PortfolioEntity({
                title: 'Valid title',
                description: 'Valid description',
                visibility: 'public'
            });
            portfolio.title = 'aa';
            expect(() => portfolio.validateOnUpdate()).toThrowError("Portfolio title must be at least 3 characters long.");
        });

        it('should throw error if description is less than 10 characters on update', () => {
            const portfolio = new PortfolioEntity({
                title: 'Valid title',
                description: 'Valid description',
                visibility: 'public'
            });
            portfolio.description = 'Short';
            expect(() => portfolio.validateOnUpdate()).toThrowError("Portfolio description must be at least 10 characters long.");
        });

        it('should throw error if visibility is not "public" or "private" on update', () => {
            const portfolio = new PortfolioEntity({
                title: 'Valid title',
                description: 'Valid description.',
                visibility: 'public'
            });
            portfolio.visibility = 'restricted';
            expect(() => portfolio.validateOnUpdate()).toThrowError("Visibility must be either 'public' or 'private'.");
        });

        it('should not throw error if all fields are valid on update', () => {
            const portfolio = new PortfolioEntity({
                title: 'Valid title',
                description: 'Valid description.',
                visibility: 'public'
            });
            portfolio.title = 'Updated title';
            portfolio.description = 'Updated description.';
            portfolio.visibility = 'private';
            expect(() => portfolio.validateOnUpdate()).not.toThrow();
        });
    });
});
