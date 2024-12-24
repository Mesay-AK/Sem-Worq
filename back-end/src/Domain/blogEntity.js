class BlogEntity{
    constructor({title, content, author, tags,status,comments, liked, disliked}){
        this.title = title;
        this.content = content;
        this.author = author;
        this.tags = tags;
        this.status = status;
        this.liked = liked;
        this.comments = comments;
        this.comments = comments;
        this.comments = comments;
        this.dislikes = disliked;

    }
    validate(){
       {
        if (!this.title || this.title.trim().length < 3) {
            throw new Error("Blog title must be at least 3 characters long.");
        }

        if (!this.content || this.content.trim().length < 10) {
            throw new Error("Blog content must be at least 10 characters long.");
        }

        if (!this.author || this.author.trim().length < 2) {
            throw new Error("Author name must be at least 2 characters long.");
        }
        if(this.likes || this.dislikes){
            throw new Error("Can not like or dislike blog upon creation")
        }
    }
    }
    
    validateOnUpdate(){
        if (this.title && this.title.trim().length < 3) {
            throw new Error("Blog title must be at least 3 characters long.");
        }

        if (this.content && this.content.trim().length < 10) {
            throw new Error("Blog content must be at least 10 characters long.");
        }

        if (this.status && !['draft', 'published'].includes(this.status)) {
            throw new Error("Invalid status. Allowed values are 'draft' or 'published'.");
        }
        if(this.liked || this.disliked){
            throw new Error("Can not like or dislike blog upon creation")
        }

}
    
}



module.exports = BlogEntity;