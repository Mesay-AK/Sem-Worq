class TestimonialEntity {
    constructor({ name, email, content, company, image }) {
        this.name = name;
        this.email = email;
        this.content = content;
        this.company = company;
        this.image = image;
    }

    validate() {
        if (!this.name || this.name.trim().length < 3) {
            throw new Error("Testimonial name must be at least 3 characters long.");
        }

        if (!this.email || !/\S+@\S+\.\S+/.test(this.email)) {
            throw new Error("Invalid email format.");
        }

        if (!this.content || this.content.trim().length < 10) {
            throw new Error("Testimonial content must be at least 10 characters long.");
        }

        if (!this.company || this.company.trim().length < 3) {
            throw new Error("Company Name must be at least 3 characters long.");
        }
    }

    validateOnUpdate() {
        if (this.name && this.name.trim().length < 3) {
            throw new Error("Testimonial name must be at least 3 characters long.");
        }

        if (this.email && !/\S+@\S+\.\S+/.test(this.email)) {
            throw new Error("Invalid email format.");
        }

        if (this.content && this.content.trim().length < 10) {
            throw new Error("Testimonial content must be at least 10 characters long.");
        }

        if (this.company && this.company.trim().length < 3) {
            throw new Error("Company Name must be at least 3 characters long.");
        }
    }
}

module.exports = TestimonialEntity;
