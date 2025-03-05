class BlogEntity {
    constructor({ title, content, author, image, tags = [], status, comments = [], liked = [], disliked = [] }) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.image = image;
        this.tags = tags;
        this.status = status;
        this.comments = comments;
        this.liked = liked;
        this.disliked = disliked;
    }

    validate() {
        if (!this.title || this.title.trim().length < 3) {
            throw new Error("Blog title must be at least 3 characters long.");
        }

        if (!this.content || this.content.trim().length < 10) {
            throw new Error("Blog content must be at least 10 characters long.");
        }

        if (!this.author || this.author.trim().length < 2) {
            throw new Error("Author name must be at least 2 characters long.");
        }

        if (!this.image) {
            throw new Error("Blog image is required.");
        }

        if (this.liked.length > 0 || this.disliked.length > 0) {
            throw new Error("Cannot like or dislike blog upon creation.");
        }
    }

    validateOnUpdate() {
        if (this.title && this.title.trim().length < 3) {
            throw new Error("Blog title must be at least 3 characters long.");
        }

        if (this.content && this.content.trim().length < 10) {
            throw new Error("Blog content must be at least 10 characters long.");
        }

        if (this.status && !['draft', 'published'].includes(this.status)) {
            throw new Error("Invalid status. Allowed values are 'draft' or 'published'.");
        }

        if (this.liked.length > 0 || this.disliked.length > 0) {
            throw new Error("Cannot like or dislike blog upon update.");
        }
    }
}

module.exports = BlogEntity;
