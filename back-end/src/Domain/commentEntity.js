class CommentEntity{
    constructor(blogId, email, content){
        this.blogId = blogId;
        this.email = email;
        this.content = content;
    }
    validateForComment() {
        if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            throw new Error("Invalid email address.");
        }
    if (!this.content || this.content.trim().length === 0) {
        throw new Error("Comment content cannot be empty.");
    }
        }
    }


module.exports = CommentEntity