class ContactUsEntity {
  constructor({ firstName, lastName, email, subject, message }) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.subject = subject;
    this.message = message;
  }

  validate() {
    if (!this.firstName || !this.lastName || !this.email || !this.subject || !this.message) {
      throw new Error('All fields are required');
    }

    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('Invalid email format');
    }
  }
}

module.exports = ContactUsEntity;
