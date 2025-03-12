const ServiceController = require("../../adapters/controllers/ServicesController");
const Service = require("../../Domain/ServicesEntity");

describe("ServiceController", () => {
  let serviceRepo;
  let controller;
  let req;
  let res;

  beforeEach(() => {
    serviceRepo = {
      CreateService: jest.fn(),
      UpdateService: jest.fn(),
      DeleteService: jest.fn(),
      GetAllServices: jest.fn(),
      GetServiceById: jest.fn(),
      count: jest.fn(),
    };

    controller = new ServiceController(serviceRepo);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createService", () => {
    it("should create a new service successfully", async () => {
    const req = {
        body: {
        title: "Test Service",
        description: "Test Description"
        },
        file: { buffer: Buffer.from("image data") }, 
    };

    const mockService = {
        _id: "123",
        title: "Test Service",
        description: "Test Description",
        image: Buffer.from("image data"),
    };

    serviceRepo.CreateService.mockResolvedValue(mockService);

    await controller.createService(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
        success: true,
        service: mockService,
    });
    });


    it("should return 400 if title or description is missing", async () => {
      req.body = { title: "Test Service" }; 
      req.file = { buffer: Buffer.from("image data") };

      await controller.createService(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Title and description are required." });
    });

    it("should return 400 if image is missing", async () => {
      req.body = { title: "Test Service", description: "Test Description" };
      req.file = null;

      await controller.createService(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Image is required." });
    });

    it("should handle unexpected errors gracefully", async () => {
      req.body = { title: "Test Service", description: "Test Description" };
      req.file = { buffer: Buffer.from("image data") };

      serviceRepo.CreateService.mockRejectedValue(new Error("Something went wrong"));

      await controller.createService(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Something went wrong" });
    });
  });

  describe("updateService", () => {
    it("should update an existing service successfully", async () => {
      const updatedService = { _id: "123", title: "Updated Service", description: "Updated Description", image: Buffer.from("image") };
      req.params = { id: "123" };
      req.body = { title: "Updated Service", description: "Updated Description" };
      req.file = { buffer: Buffer.from("new image data") };

      serviceRepo.UpdateService.mockResolvedValue(updatedService);

      await controller.updateService(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, service: updatedService });
    });

    it("should return 400 if service ID is missing", async () => {
      req.params = {};

      await controller.updateService(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service ID is required for updates." });
    });

    it("should return 404 if service is not found", async () => {
      const mockServiceId = "123";
      req.params = { id: mockServiceId };

      serviceRepo.UpdateService.mockResolvedValue(null); // No service found

      await controller.updateService(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Service not found." });
    });

    it("should handle unexpected errors gracefully", async () => {
      const mockServiceId = "123";
      req.params = { id: mockServiceId };
      req.body = { title: "Updated Service" };

      serviceRepo.UpdateService.mockRejectedValue(new Error("Unexpected error"));

      await controller.updateService(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unexpected error" });
    });
  });

  describe("deleteService", () => {
    it("should delete a service successfully", async () => {
      const deletedService = { _id: "123", title: "Deleted Service" };
      req.params = { id: "123" };

      serviceRepo.DeleteService.mockResolvedValue(deletedService);

      await controller.deleteService(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Service deleted successfully", deletedService });
    });

    it("should return 400 if service ID is missing", async () => {
      req.params = {}; // No ID

      await controller.deleteService(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Service ID is required for deletion." });
    });

    it("should return 404 if service is not found", async () => {
      const mockServiceId = "123";
      req.params = { id: mockServiceId };

      serviceRepo.DeleteService.mockResolvedValue(null); // No service found

      await controller.deleteService(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Service not found." });
    });

    it("should handle unexpected errors gracefully", async () => {
      const mockServiceId = "123";
      req.params = { id: mockServiceId };

      serviceRepo.DeleteService.mockRejectedValue(new Error("Unexpected error"));

      await controller.deleteService(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unexpected error" });
    });
  });

  describe("listServices", () => {
    it("should return paginated services", async () => {
      const mockServices = [{ _id: "123", title: "Service 1" }, { _id: "124", title: "Service 2" }];
      req.query = { page: 1, limit: 10 };

      serviceRepo.GetAllServices.mockResolvedValue(mockServices);
      serviceRepo.count.mockResolvedValue(20);

      await controller.listServices(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        services: mockServices,
        pagination: {
          page: 1,
          limit: 10,
          total: 20,
          totalPages: 2,
        },
      });
    });

    it("should handle errors in listing services", async () => {
    req.query = {}; 
    serviceRepo.GetAllServices.mockRejectedValue(new Error("Database error"));
    serviceRepo.count.mockRejectedValue(new Error("Database error"));

    await controller.listServices(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Unexpected error",
    });
    });
    })

  describe("getServiceById", () => {
    it("should return service by ID successfully", async () => {
      const mockService = {
        _id: "123",
        title: "Test Service",
        description: "Test Description",
        image: Buffer.from("image data"),
        createdAt: "2022-01-01",
        updatedAt: "2022-01-01",
      };
      req.params = { id: "123" };

      serviceRepo.GetServiceById.mockResolvedValue(mockService);

      await controller.getServiceById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        service: {
          id: mockService._id,
          title: mockService.title,
          description: mockService.description,
          image: expect.stringContaining("data:image/png;base64"),
          createdAt: mockService.createdAt,
          updatedAt: mockService.updatedAt,
        },
      });
    });

    it("should return 404 if service is not found", async () => {
      req.params = { id: "123" };

      serviceRepo.GetServiceById.mockResolvedValue(null); // No service found

      await controller.getServiceById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Service not found." });
    });

    it("should handle unexpected errors gracefully", async () => {
      req.params = { id: "123" };

      serviceRepo.GetServiceById.mockRejectedValue(new Error("Unexpected error"));

      await controller.getServiceById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unexpected error" });
    });
  });
});
