class ServicesEntity {
    constructor({ title, description, image }) {
        this.title = title;
        this.description = description;
        this.image = image;
    }

    validate() {

        this.title = this.title.trim();
        this.description = this.description.trim();
        this.image = this.image ? this.image.trim() : null;

        if (!this.title || this.title.length < 3) {
            throw new Error("Service title must be at least 3 characters long.");
        }

        // Validate description
        if (!this.description || this.description.length < 10) {
            throw new Error("Service description must be at least 10 characters long.");
        }

        if (this.image && this.image.length < 5) {
            throw new Error("Service image must be at least 5 characters long.");
        }
    }
}

module.exports = ServicesEntity;
