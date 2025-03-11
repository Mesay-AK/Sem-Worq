const BlogController = require("../../adapters/controllers/blogsController");

describe("BlogController Tests", () => {
    let blogRepository, controller, req, res;

    beforeEach(() => {
        blogRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            addComment: jest.fn(),
        };

        controller = new BlogController(blogRepository);

        req = { params: {}, body: {}, file: null };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe("createBlog", () => {
        it("should return 400 if required fields are missing", async () => {
            req.body = { title: "", content: "", author: "" };

            await controller.createBlog(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Title, content, and author are required." });
        });

        it("should return 201 if blog is created", async () => {
            req.body = { 
                title: "Valid Title", 
                content: "This is a valid blog content.",  // At least 10 characters!
                author: "Author Name" 
            };
            
            req.file = { buffer: Buffer.from("fake image data") };  // Simulating image upload

            const mockBlog = { ...req.body, id: "12345", image: req.file.buffer };
            blogRepository.create.mockResolvedValue(mockBlog);

            await controller.createBlog(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockBlog);
        });


    });

    describe("getBlog", () => {
        it("should return 400 if invalid blog ID is provided", async () => {
            req.params.id = "invalidID";

            await controller.getBlog(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid blog ID." });
        });

        it("should return 404 if blog is not found", async () => {
            req.params.id = "60d0fe4f5311236168a109ca";
            blogRepository.findById.mockResolvedValue(null);

            await controller.getBlog(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Blog not found." });
        });

        it("should return 200 with blog details", async () => {
            const blog = { title: "Test Blog", content: "Some content" };
            req.params.id = "60d0fe4f5311236168a109ca";
            blogRepository.findById.mockResolvedValue(blog);

            await controller.getBlog(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(blog);
        });
    });

    describe("deleteBlog", () => {
        it("should return 400 if blog ID is invalid", async () => {
            req.params.id = "invalidID";

            await controller.deleteBlog(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Invalid blog ID." });
        });

        it("should return 404 if blog is not found", async () => {
            req.params.id = "60d0fe4f5311236168a109ca";
            blogRepository.delete.mockResolvedValue(null);

            await controller.deleteBlog(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Blog not found." });
        });

        it("should return 200 if blog is deleted", async () => {
            req.params.id = "60d0fe4f5311236168a109ca";
            blogRepository.delete.mockResolvedValue(true);

            await controller.deleteBlog(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Blog deleted successfully." });
        });
    });
});
