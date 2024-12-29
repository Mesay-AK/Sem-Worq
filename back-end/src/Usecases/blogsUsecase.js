const BlogEntity = require("../Domain/blogEntity");












const updateBlog = async (id, updateData) => {

    const BlogEntity = new BlogEntity(updateData)
    BlogEntity.validateOnUpdate()

    // Delegate the actual database update to the repository
    return await this.blogRepository.update(id, updateData);
}
