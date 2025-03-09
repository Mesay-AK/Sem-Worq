const ServiceRepository = require("../../Repositories/ServicesRepo");
const ServiceModel = require("../../Infrastructures/models/ServicesModel");

jest.mock("../../Infrastructures/models/ServicesModel");

describe("ServiceRepository", () => {
  let serviceRepository;

  beforeEach(() => {
    serviceRepository = new ServiceRepository();
    jest.clearAllMocks();
  });

  describe("createService", () => {
    it("should create a new service successfully", async () => {
      const serviceData = { title: "Web Design", description: "Professional web design services" };
      ServiceModel.findOne.mockResolvedValue(null); 
      ServiceModel.prototype.save = jest.fn().mockResolvedValue(serviceData);

      const result = await serviceRepository.createService(serviceData);

      expect(ServiceModel.findOne).toHaveBeenCalledWith({ title: serviceData.title });
      expect(ServiceModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(serviceData);
    });

    it("should throw an error if service already exists", async () => {
      const serviceData = { title: "Web Design" };
      ServiceModel.findOne.mockResolvedValue(serviceData);

      await expect(serviceRepository.createService(serviceData)).rejects.toThrow("Service already exists.");
    });

    it("should throw an error if database operation fails", async () => {
      const serviceData = { title: "Web Development" };
      ServiceModel.findOne.mockRejectedValue(new Error("Database error"));

      await expect(serviceRepository.createService(serviceData)).rejects.toThrow("Error while creating service: Database error");
    });
  });

  describe("updateService", () => {
    it("should update an existing service successfully", async () => {
      const serviceId = "123";
      const updateData = { title: "Updated Service" };
      ServiceModel.findByIdAndUpdate.mockResolvedValue({ _id: serviceId, ...updateData });

      const result = await serviceRepository.updateService(serviceId, updateData);

      expect(ServiceModel.findByIdAndUpdate).toHaveBeenCalledWith(serviceId, updateData, { new: true });
      expect(result).toEqual({ _id: serviceId, ...updateData });
    });

    it("should throw an error if service to update is not found", async () => {
      const serviceId = "123";
      ServiceModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(serviceRepository.updateService(serviceId, { title: "New Title" })).rejects.toThrow(`Service with ID ${serviceId} not found.`);
    });

    it("should throw an error if database operation fails", async () => {
      ServiceModel.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

      await expect(serviceRepository.updateService("123", { title: "New Title" })).rejects.toThrow("Error updating service: Database error");
    });
  });

  describe("deleteService", () => {
    it("should delete a service successfully", async () => {
      const serviceId = "123";
      ServiceModel.findByIdAndDelete.mockResolvedValue({ _id: serviceId });

      const result = await serviceRepository.deleteService(serviceId);

      expect(ServiceModel.findByIdAndDelete).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual({ _id: serviceId });
    });

    it("should throw an error if service to delete is not found", async () => {
      ServiceModel.findByIdAndDelete.mockResolvedValue(null);

      await expect(serviceRepository.deleteService("123")).rejects.toThrow("Service with ID 123 not found.");
    });

    it("should throw an error if database operation fails", async () => {
      ServiceModel.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

      await expect(serviceRepository.deleteService("123")).rejects.toThrow("Error deleting service: Database error");
    });
  });


  describe("getAllServices", () => {
    it("should return a list of services", async () => {
      const services = [{ title: "Service 1" }, { title: "Service 2" }];
      ServiceModel.find.mockReturnValue({ skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), sort: jest.fn().mockResolvedValue(services) });

      const result = await serviceRepository.getAllServices(1, 10);

      expect(ServiceModel.find).toHaveBeenCalled();
      expect(result).toEqual(services);
    });

    it("should throw an error if fetching services fails", async () => {
      ServiceModel.find.mockImplementation(() => { throw new Error("Database error"); });

      await expect(serviceRepository.getAllServices()).rejects.toThrow("Error retrieving services: Database error");
    });
  });


  describe("count", () => {
    it("should return the correct count of services", async () => {
      ServiceModel.countDocuments.mockResolvedValue(5);

      const result = await serviceRepository.count();

      expect(ServiceModel.countDocuments).toHaveBeenCalled();
      expect(result).toBe(5);
    });

    it("should throw an error if count operation fails", async () => {
      ServiceModel.countDocuments.mockRejectedValue(new Error("Database error"));

      await expect(serviceRepository.count()).rejects.toThrow("Error while counting services: Database error");
    });
  });


  describe("getServiceById", () => {
    it("should return a service by ID", async () => {
      const serviceId = "123";
      const service = { _id: serviceId, title: "Test Service" };
      ServiceModel.findById.mockResolvedValue(service);

      const result = await serviceRepository.getServiceById(serviceId);

      expect(ServiceModel.findById).toHaveBeenCalledWith(serviceId);
      expect(result).toEqual(service);
    });

    it("should throw an error if service is not found", async () => {
      ServiceModel.findById.mockResolvedValue(null);

      await expect(serviceRepository.getServiceById("123")).rejects.toThrow("Service with ID 123 not found.");
    });

    it("should throw an error if database operation fails", async () => {
      ServiceModel.findById.mockRejectedValue(new Error("Database error"));

      await expect(serviceRepository.getServiceById("123")).rejects.toThrow("Error retrieving service: Database error");
    });
  });
});
