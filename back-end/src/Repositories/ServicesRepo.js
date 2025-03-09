const ServiceModel = require("../Infrastructures/models/ServicesModel");

class ServiceRepository {
  
  async createService(service) {
    try {
      const existingService = await ServiceModel.findOne({ title: service.title });

      if (existingService) {
        throw new Error("Service already exists.");
      }
      
      const newService = new ServiceModel(service);
      return await newService.save();
    } catch (error) {
      throw new Error(`Error while creating service: ${error.message}`);
    }
  }

  async updateService(id, updatedFields) {
    try {
      const updatedService = await ServiceModel.findByIdAndUpdate(id, updatedFields, { new: true });

      if (!updatedService) {
        throw new Error(`Service with ID ${id} not found.`);
      }

      return updatedService;
    } catch (error) {
      throw new Error(`Error updating service: ${error.message}`);
    }
  }

  async deleteService(id) {
    try {
      const deletedService = await ServiceModel.findByIdAndDelete(id);

      if (!deletedService) {
        throw new Error(`Service with ID ${id} not found.`);
      }

      return deletedService;
    } catch (error) {
      throw new Error(`Error deleting service: ${error.message}`);
    }
  }

  async getAllServices(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      return await ServiceModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Error retrieving services: ${error.message}`);
    }
  }

  async count() {
    try {
      return await ServiceModel.countDocuments();
    } catch (error) {
      throw new Error(`Error while counting services: ${error.message}`);
    }
  }

  async getServiceById(id) {
    try {
      const service = await ServiceModel.findById(id);
      if (!service) {
        throw new Error(`Service with ID ${id} not found.`);
      }
      return service;
    } catch (error) {
      throw new Error(`Error retrieving service: ${error.message}`);
    }
  }
}

module.exports = ServiceRepository;
