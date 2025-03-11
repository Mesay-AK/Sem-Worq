const PortfolioController = require("../../adapters/controllers/portfolioController");


const mockRepository = {
    findAll: jest.fn(),
    count: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
};

let controller;
let req;
let res;

beforeEach(() => {
    controller = new PortfolioController(mockRepository);
    req = {};
    res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
    };
});

describe("PortfolioController", () => {
    describe("listPortfolios", () => {
        it("should return a list of portfolios with pagination", async () => {
            const portfolios = [{ title: "Portfolio 1" }, { title: "Portfolio 2" }];
            const total = 2;
            mockRepository.findAll.mockResolvedValue(portfolios);
            mockRepository.count.mockResolvedValue(total);

            req.query = { page: 1, limit: 10 };
            await controller.listPortfolios(req, res);

            expect(res.json).toHaveBeenCalledWith({
                portfolios,
                pagination: {
                    page: 1,
                    limit: 10,
                    total,
                    totalPages: 1,
                },
            });
        });

        it("should handle errors properly", async () => {
            mockRepository.findAll.mockRejectedValue(new Error("Database error"));

            await controller.listPortfolios(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
        });
    });

    describe("getPortfolioById", () => {
        it("should return a portfolio by ID", async () => {
            const mockPortfolio = {
                _id: "12345",
                title: "Portfolio 1",
                description: "This is a test portfolio.",
                image: Buffer.from("image data"), 
                visibility: "public",
                toObject: jest.fn().mockReturnValue({
                    _id: "12345",
                    title: "Portfolio 1",
                    description: "This is a test portfolio.",
                    image: Buffer.from("image data"), // Mock image buffer
                    visibility: "public",
                }),
            };

            req.params = { id: "12345" };
            mockRepository.findById.mockResolvedValue(mockPortfolio); 

            await controller.getPortfolioById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);

            expect(res.json).toHaveBeenCalledWith({
                _id: "12345",
                title: "Portfolio 1",
                description: "This is a test portfolio.",
                image: `data:image/jpeg;base64,${mockPortfolio.image.toString("base64")}`, // Check base64 encoding
                visibility: "public",
            });
        });


        it("should return 404 if portfolio is not found", async () => {
            mockRepository.findById.mockResolvedValue(null);

            req.params = { id: "1" };
            await controller.getPortfolioById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: "Portfolio not found" });
        });

        it("should handle errors properly", async () => {
            mockRepository.findById.mockRejectedValue(new Error("Database error"));

            req.params = { id: "1" };
            await controller.getPortfolioById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to retrieve portfolio" });
        });
    });

    describe("createPortfolio", () => {
        it("should handle validation errors (title)", async () => {
            const errorMessage = "Portfolio title must be at least 3 characters long.";

            req.body = { title: "", description: "Description", tags: ["tag1"], visibility: "public" };
            req.file = { buffer: Buffer.from("image") };

            await controller.createPortfolio(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it("should handle validation errors (visibility)", async () => {
            const errorMessage = "Visibility must be either 'public' or 'private'.";

            req.body = { title: "Portfolio 1", description: "Description", tags: ["tag1"], visibility: "invalid" };
            req.file = { buffer: Buffer.from("image") };

            await controller.createPortfolio(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
        });

        it("should handle errors during creation (database)", async () => {
            mockRepository.create.mockRejectedValue(new Error("Database error"));

            req.body = { title: "Portfolio 1", description: "Description", tags: ["tag1"], visibility: "public" };
            req.file = { buffer: Buffer.from("image") };

            await controller.createPortfolio(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
        });
    });


    describe("updatePortfolio", () => {
        it("should update a portfolio", async () => {
            const updatedPortfolio = { title: "Updated Portfolio", description: "Updated description" };
            mockRepository.updateById.mockResolvedValue(updatedPortfolio);

            req.params = { id: "1" };
            req.body = updatedPortfolio;
            req.file = { buffer: Buffer.from("newImage") };

            await controller.updatePortfolio(req, res);

            expect(res.json).toHaveBeenCalledWith({
                message: "Portfolio Updated Successfully.",
                updated: updatedPortfolio,
            });
        });

        it("should handle errors during update", async () => {
            mockRepository.updateById.mockRejectedValue(new Error("Update failed"));

            req.params = { id: "1" };
            req.body = { title: "Updated Portfolio" };

            await controller.updatePortfolio(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Update failed" });
        });
    });

    describe("deletePortfolio", () => {
        it("should delete a portfolio", async () => {
            const result = { deletedCount: 1 };
            mockRepository.deleteById.mockResolvedValue(result);

            req.params = { id: "1" };
            await controller.deletePortfolio(req, res);

            expect(res.json).toHaveBeenCalledWith({
                message: "Portfolio deleted successfully.",
                result,
            });
        });

        it("should handle errors during delete", async () => {
            mockRepository.deleteById.mockRejectedValue(new Error("Delete failed"));

            req.params = { id: "1" };
            await controller.deletePortfolio(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Delete failed" });
        });
    });
});
