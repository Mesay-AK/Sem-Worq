class TestimonialEntity {
    constructor({ name, email, content, rating }) {
        this.name = name;
        this.email = email;
        this.content = content;
        this.rating = rating;
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

        if (this.rating < 1 || this.rating > 5) {
            throw new Error("Rating must be between 1 and 5.");
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

        if (this.rating && (this.rating < 1 || this.rating > 5)) {
            throw new Error("Rating must be between 1 and 5.");
        }
    }
}

module.exports = TestimonialEntity;
