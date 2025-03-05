const ContactUsEntity = require('../../Domain/ContactUsEntity');

describe('ContactUsEntity', () => {
  describe('constructor', () => {
    it('should initialize with correct properties', () => {
      const contact = new ContactUsEntity({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        subject: 'Subject',
        message: 'This is a message.'
      });

      expect(contact.firstName).toBe('John');
      expect(contact.lastName).toBe('Doe');
      expect(contact.email).toBe('john.doe@example.com');
      expect(contact.subject).toBe('Subject');
      expect(contact.message).toBe('This is a message.');
    });
  });

  describe('validate method', () => {
    it('should throw error if email format is invalid', () => {
      const contact = new ContactUsEntity({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        subject: 'Subject',
        message: 'This is a message.'
      });

      expect(() => contact.validate()).toThrowError('Invalid email format');
    });

    it('should not throw error if all fields are valid', () => {
      const contact = new ContactUsEntity({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        subject: 'Subject',
        message: 'This is a message.'
      });

      expect(() => contact.validate()).not.toThrow();
    });
  });
});
