class PortfolioEntity {
    constructor({ title, description, date, tags, media, visibility }) {
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.media = media;
        this.visibility = visibility;
    }

    validate() {
        if (!this.title || this.title.trim().length < 3) {
            throw new Error("Portfolio title must be at least 3 characters long.");
        }

        if (!this.description || this.description.trim().length < 10) {
            throw new Error("Portfolio description must be at least 10 characters long.");
        }

        if (!['public', 'private'].includes(this.visibility)) {
            throw new Error("Visibility must be either 'public' or 'private'.");
        }
    }

    validateOnUpdate() {
        if (this.title && this.title.trim().length < 3) {
            throw new Error("Portfolio title must be at least 3 characters long.");
        }

        if (this.description && this.description.trim().length < 10) {
            throw new Error("Portfolio description must be at least 10 characters long.");
        }

        if (this.visibility && !['public', 'private'].includes(this.visibility)) {
            throw new Error("Visibility must be either 'public' or 'private'.");
        }
    }
}

module.exports = PortfolioEntity;
